#!/bin/bash

CURRENT=$(cd $(dirname $0);pwd)
ASSETS_DIR="${CURRENT}/../assets"

for file in "${ASSETS_DIR}"/*.png; do
  ffmpeg -i "$file" -pix_fmt yuv420p -t 1 -r 1 -f yuv4mpegpipe "${file%.*}.y4m"
done
