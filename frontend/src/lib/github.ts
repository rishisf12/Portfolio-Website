export async function fetchGitHubRepos(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((repo: any) => ({
      name: repo.name,
      description: repo.description || "No description",
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language || "Unknown",
      stars: repo.stargazers_count || 0,
      updated: repo.updated_at,
      topics: repo.topics || [],
      image: repo.owner?.avatar_url ? repo.owner.avatar_url.replace("?v=4", "") : null,
    }));
  } catch {
    return [];
  }
}