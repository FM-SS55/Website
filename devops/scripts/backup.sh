#!/usr/bin/env bash
# Copies the SQLite DB + uploads into a dated folder. Usage: ./backup.sh [dest-dir]
set -e
APP=/var/www/pulizia-fm/backend
DEST="${1:-$HOME/backups}/$(date +%F)"
mkdir -p "$DEST"
cp "$APP/database/pulizia.sqlite" "$DEST/"
cp -r "$APP/uploads" "$DEST/"
echo "Backup written to $DEST"