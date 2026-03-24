#!/system/bin/sh
MODULE_DIR=/data/adb/modules/raphael-popup-cam-light
/system/bin/sh "$MODULE_DIR/system/bin/raphael_popup_lightd.sh" &
python3 "$MODULE_DIR/webgui/webgui_server.py" &
