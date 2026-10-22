import os, sys
from urllib.parse import urlparse, quote, unquote

POOLER_HOST = os.environ.get("SUPABASE_POOLER_HOST", "aws-0-ap-south-1.pooler.supabase.com")

source = "DB_URL_POOLER" if os.environ.get("DB_URL_POOLER") else "DATABASE_URL"
raw = os.environ.get(source, "").strip().strip('"').strip("'")
if not raw:
    print(f"[db-check] ERROR: {source} is empty in this container. The app may read a different variable, or Render did not save it.", file=sys.stderr)
    sys.exit(1)

raw = raw.replace("postgres://", "postgresql://", 1)
raw = raw.replace(".pooler.supabase.co:", ".pooler.supabase.com:")
p = urlparse(raw)
host, user = p.hostname, p.username
print(f"[db-check] source={source} host={host} user={user} port={p.port}", file=sys.stderr)

if host and host.startswith("db.") and host.endswith(".supabase.co"):
    ref = host[len("db."):-len(".supabase.co")]
    if "." not in (user or ""):
        user = f"{user}.{ref}"
    pwd = quote(unquote(p.password or ""), safe="")
    path = p.path or "/postgres"
    raw = f"postgresql://{user}:{pwd}@{POOLER_HOST}:5432{path}"
    print(f"[db-check] direct host is IPv6-only, switched to {POOLER_HOST} as {user}", file=sys.stderr)

print(raw)
