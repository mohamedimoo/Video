#!/bin/bash
# contact sheet: tools/sheet.sh <dir> <cols> <rows> -> <dir>/sheet_N.png
d=$1; c=${2:-4}; r=${3:-4}
ffmpeg -loglevel error -y -pattern_type glob -i "$d/b*.jpg" -vf "scale=480:270,tile=${c}x${r}:padding=4:color=white" "$d/sheet_%02d.png"
