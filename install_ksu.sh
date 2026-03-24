#!/bin/sh
ZIP_PATH="$1"
MODULE_DIR="/data/adb/modules/raphael-popup-cam-light"
if [ -z "$ZIP_PATH" ]; then
  echo "Usage: install_ksu.sh /path/to/raphael-popup-cam-light.zip"
  exit 1
fi
if [ ! -f "$ZIP_PATH" ]; then
  echo "Zip file not found: $ZIP_PATH"
  exit 2
fi
ksu -c "mkdir -p $MODULE_DIR && rm -rf $MODULE_DIR/*"
ksu -c "cd /data/adb/modules && unzip -o $ZIP_PATH -d raphael-popup-cam-light"
ksu -c "chmod -R 755 $MODULE_DIR"
ksu -c "echo Installed raphael-popup-cam-light module to $MODULE_DIR"
ksu -c "reboot"
