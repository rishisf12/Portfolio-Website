"""Generate a bcrypt hash for ADMIN_PASSWORD_HASH.

Usage:
    python -m app.core.security_hash "your-new-password"

Prints a single line to paste into backend/.env as:
    ADMIN_PASSWORD_HASH=<the value printed>
"""

import getpass
import sys

from app.core.security import hash_password, verify_password


def main() -> int:
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        try:
            password = getpass.getpass("Admin password: ")
            confirm = getpass.getpass("Confirm password: ")
        except (EOFError, KeyboardInterrupt):
            print("\nAborted.", file=sys.stderr)
            return 1

        if password != confirm:
            print("Passwords do not match.", file=sys.stderr)
            return 1

    if len(password) < 12:
        print("Warning: use at least 12 characters.", file=sys.stderr)

    hashed = hash_password(password)

    # Confirm the hash round-trips before handing it over.
    if not verify_password(password, hashed):
        print("Hash verification failed; not writing anything.", file=sys.stderr)
        return 1

    print(hashed)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
