# Usage: python scripts/set_admin_password.py "yourNewPassword"
# Prints a hash — paste it into .env as ADMIN_PASSWORD_HASH

import sys
from werkzeug.security import generate_password_hash

if len(sys.argv) < 2:
    print('Usage: python scripts/set_admin_password.py "yourNewPassword"')
    sys.exit(1)

password = sys.argv[1]
hashed = generate_password_hash(password)
print('\nAdd this line to your .env file:\n')
print(f'ADMIN_PASSWORD_HASH={hashed}\n')