#!/system/bin/sh
MODDIR=${0%/*}
CONFIG_FILE="$MODDIR/config.json"
LOG_FILE="/data/local/tmp/raphael_led.log"

log() {
    echo "$(date) - $1" >> "$LOG_FILE"
}

log "Service started, waiting for boot..."
until [ "$(getprop sys.boot_completed)" = "1" ]; do
    sleep 5
done
log "Boot completed. Initializing LEDs."

RED_LED="/sys/class/leds/red/brightness"
GREEN_LED="/sys/class/leds/green/brightness"
BLUE_LED="/sys/class/leds/blue/brightness"

set_led() {
    [ -f "$RED_LED" ] && echo "$1" > "$RED_LED"
    [ -f "$GREEN_LED" ] && echo "$1" > "$GREEN_LED"
    [ -f "$BLUE_LED" ] && echo "$1" > "$BLUE_LED"
}

set_led 0

while true; do
    CALL_STATE=$(dumpsys telephony.registry | grep -m 1 "mCallState" | awk -F= '{print $2}' | tr -d ' ' | tr -d '\r')
    if [ "$CALL_STATE" = "1" ] || echo "$CALL_STATE" | grep -iq "ringing"; then
        log "Incoming call detected! Ringing state active."
        RINGER_MODE=$(dumpsys audio | grep -m 1 -E 'ringerModeInternal' | awk -F: '{print $2}' | tr -d ' ' | tr -d '\r')
        
        MODE="always"; SPEED="500"; PATTERN="blink"; CUSTOM="300,200,300,200,300,1000"
        if [ -f "$CONFIG_FILE" ]; then
            MODE=$(grep -o '"trigger_mode":"[^"]*"' "$CONFIG_FILE" | awk -F'"' '{print $4}')
            SPEED=$(grep -o '"blink_speed":"[^"]*"' "$CONFIG_FILE" | awk -F'"' '{print $4}')
            PATTERN=$(grep -o '"pattern":"[^"]*"' "$CONFIG_FILE" | awk -F'"' '{print $4}')
            CUSTOM=$(grep -o '"custom_pattern":"[^"]*"' "$CONFIG_FILE" | awk -F'"' '{print $4}')
        fi
        
        [ -z "$MODE" ] && MODE="always"
        [ -z "$SPEED" ] && SPEED="500"
        [ -z "$PATTERN" ] && PATTERN="blink"
        [ -z "$CUSTOM" ] && CUSTOM="300,200,300,200,300,1000"

        SHOULD_BLINK=0
        if [ "$MODE" = "always" ]; then
            SHOULD_BLINK=1
        elif [ "$MODE" = "silent" ] && [ "$RINGER_MODE" = "0" ]; then
            SHOULD_BLINK=1
        elif [ "$MODE" = "vibrate" ] && [ "$RINGER_MODE" = "1" ]; then
            SHOULD_BLINK=1
        elif [ "$MODE" = "silent_vibrate" ] && { [ "$RINGER_MODE" = "0" ] || [ "$RINGER_MODE" = "1" ]; }; then
            SHOULD_BLINK=1
        fi

        if [ "$SHOULD_BLINK" = "1" ]; then
            log "Blinking LED: pattern=$PATTERN speed=$SPEED mode=$MODE"
            if [ "$PATTERN" = "solid" ]; then
                set_led 255
                sleep 2
            elif [ "$PATTERN" = "triple" ]; then
                for i in 1 2 3; do
                    set_led 255
                    usleep 300000
                    set_led 0
                    usleep 200000
                done
                usleep 1000000
            elif [ "$PATTERN" = "custom" ]; then
                OIFS=$IFS
                IFS=','
                set -- $CUSTOM
                IFS=$OIFS
                STATE=1
                for DUR in "$@"; do
                    DUR_CLEAN=$(echo "$DUR" | tr -cd '0-9')
                    [ -z "$DUR_CLEAN" ] && DUR_CLEAN=100
                    if [ "$STATE" = "1" ]; then
                        set_led 255
                        STATE=0
                    else
                        set_led 0
                        STATE=1
                    fi
                    usleep $(( DUR_CLEAN * 1000 ))
                done
                set_led 0
                usleep 500000
            else
                set_led 255
                usleep $((SPEED * 1000))
                set_led 0
                usleep $((SPEED * 1000))
            fi
        else
            sleep 1
        fi
    else
        set_led 0
        sleep 1
    fi
done
