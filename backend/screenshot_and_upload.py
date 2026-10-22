#!/usr/bin/env python
"""
Screenshot all GitHub repo pages and upload to Cloudinary via admin API.
Updates each project in the database with the new image URL.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from playwright.async_api import async_playwright
import httpx
from app.core.config import settings


GITHUB_REPOS = [
    {
        "title": "Portfolio Website",
        "github_url": "https://github.com/rishisf12/Portfolio-Website",
    },
    {
        "title": "CampusPilot",
        "github_url": "https://github.com/rishisf12/CampusPilot",
    },
    {
        "title": "UrTeam (TeamPilot)",
        "github_url": "https://github.com/rishisf12/UrTeam",
    },
    {
        "title": "PocketPilot (pocketF)",
        "github_url": "https://github.com/rishisf12/pocketF",
    },
    {
        "title": "Master DSA Frontend",
        "github_url": "https://github.com/rishisf12/master-dsa-frontend",
    },
    {
        "title": "Master DSA Backend",
        "github_url": "https://github.com/rishisf12/master-dsa-backend",
    },
]


async def login_admin(client: httpx.AsyncClient) -> str:
    """Login to admin and return access token."""
    response = await client.post(
        "http://localhost:8000/api/v1/auth/login",
        json={"username": settings.ADMIN_USERNAME, "password": os.getenv("ADMIN_PASSWORD", "")},
    )
    response.raise_for_status()
    return response.json()["access_token"]


async def upload_image(client: httpx.AsyncClient, token: str, image_path: str) -> str:
    """Upload image to Cloudinary via admin API, return secure URL."""
    with open(image_path, "rb") as f:
        files = {"file": (os.path.basename(image_path), f, "image/png")}
        headers = {"Authorization": f"Bearer {token}"}
        response = await client.post(
            "http://localhost:8000/api/v1/admin/upload-image",
            files=files,
            headers=headers,
        )
    response.raise_for_status()
    return response.json()["url"]


async def update_project_image(client: httpx.AsyncClient, token: str, project_id: int, image_url: str):
    """Update project with new image URL."""
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = await client.put(
        f"http://localhost:8000/api/v1/admin/projects/{project_id}",
        json={"image": image_url},
        headers=headers,
    )
    response.raise_for_status()
    return response.json()


async def get_projects(client: httpx.AsyncClient, token: str):
    """Get all projects from admin API."""
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("http://localhost:8000/api/v1/admin/projects", headers=headers)
    response.raise_for_status()
    return response.json()


async def screenshot_github_repo(page, url: str, output_path: str):
    """Take screenshot of GitHub repo page."""
    print(f"  Navigating to {url}...")
    await page.goto(url, wait_until="networkidle", timeout=60000)
    
    # Wait for repo content to load
    await page.wait_for_selector("article, .repository-content, [data-testid='repo-content']", timeout=30000)
    
    # Hide annoying elements
    await page.add_style_tag(content="""
        .header, .js-header, .global-nav, footer, 
        .octocat-spinner, .ajax-pagination-form,
        .js-repo-nav, .file-navigation,
        .Box-header, .commit-tease,
        .sidebar-association, .js-sticky-top {
            display: none !important;
        }
        .repository-content {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }
        main {
            padding-top: 0 !important;
        }
    """)
    
    # Take screenshot of the main content area
    await page.screenshot(path=output_path, full_page=True)
    print("  [OK] Screenshot saved: {output_path}")


async def main():
    # Check for admin password
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_password:
        print("[ERROR] ADMIN_PASSWORD not set in environment.")
        print("Set it in backend/.env or export ADMIN_PASSWORD='your-password'")
        return 1
    
    # Create screenshots directory
    screenshots_dir = Path("screenshots")
    screenshots_dir.mkdir(exist_ok=True)
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # Login
        print("[LOGIN] Logging in to admin...")
        try:
            token = await login_admin(client)
            print("  [OK] Logged in successfully")
        except Exception as e:
            print(f"  [ERROR] Login failed: {e}")
            print("  Make sure ADMIN_PASSWORD_HASH is set in backend/.env and matches ADMIN_PASSWORD")
            return 1
        
        # Get current projects to map titles to IDs
        print("[LIST] Fetching current projects...")
        projects = await get_projects(client, token)
        project_map = {p["title"]: p["id"] for p in projects}
        print(f"  Found {len(projects)} projects")
        
        # Launch browser
        async with async_playwright() as p:
            browser = await p.chromium.launch(channel="msedge", headless=True)
            page = await browser.new_page(viewport={"width": 1280, "height": 720})
            
            for repo in GITHUB_REPOS:
                title = repo["title"]
                github_url = repo["github_url"]
                project_id = project_map.get(title)
                
                if not project_id:
                    print(f"[WARN]  Project '{title}' not found in database, skipping")
                    continue
                
                print(f"\n[SCREENSHOT] Processing: {title}")
                
                # Screenshot
                screenshot_path = screenshots_dir / f"{title.lower().replace(' ', '_').replace('(', '').replace(')', '')}.png"
                try:
                    await screenshot_github_repo(page, github_url, str(screenshot_path))
                except Exception as e:
                    print(f"  [ERROR] Screenshot failed: {e}")
                    continue
                
                # Upload to Cloudinary
                print(f"  [UPLOAD]  Uploading to Cloudinary...")
                try:
                    image_url = await upload_image(client, token, str(screenshot_path))
                    print(f"  [OK] Uploaded: {image_url}")
                except Exception as e:
                    print(f"  [ERROR] Upload failed: {e}")
                    continue
                
                # Update project
                print(f"  [UPDATE] Updating project in database...")
                try:
                    updated = await update_project_image(client, token, project_id, image_url)
                    print(f"  [OK] Project updated: {updated['title']}")
                except Exception as e:
                    print(f"  [ERROR] Update failed: {e}")
                    continue
            
            await browser.close()
    
    print("\n[DONE] All done!")
    return 0


if __name__ == "__main__":
    # Load .env
    from dotenv import load_dotenv
    load_dotenv()
    
    exit_code = asyncio.run(main())
    sys.exit(exit_code)