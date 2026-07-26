#!/usr/bin/env bash
# Write the latest git commit date into _data/last_updated.yml for Jekyll.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/_data"

DATE="$(git -C "$ROOT" log -1 --format=%cd --date=format:'%b. %-d, %Y')"
printf 'date: "%s"\n' "$DATE" > "$ROOT/_data/last_updated.yml"
echo "Wrote _data/last_updated.yml with date: $DATE"
