const configFile = '/data/adb/modules/raphael_popup_cam_light/config.json';
const btn = document.getElementById('save_btn');
const triggerMode = document.getElementById('trigger_mode');
const blinkSpeed = document.getElementById('blink_speed');
const speedVal = document.getElementById('speed_val');
const pattern = document.getElementById('pattern');
const customPatternGroup = document.getElementById('custom_pattern_group');
const customPattern = document.getElementById('custom_pattern');

blinkSpeed.addEventListener('input', () => {
    speedVal.innerText = blinkSpeed.value;
});

pattern.addEventListener('change', () => {
    if (pattern.value === 'custom') {
        customPatternGroup.style.display = 'flex';
    } else {
        customPatternGroup.style.display = 'none';
    }
});

async function loadSettings() {
    // 1. Instantly load visual state from browser cache safely
    const savedLocal = localStorage.getItem('raphael_light_config');
    if (savedLocal) {
        try {
            const cfg = JSON.parse(savedLocal);
            if (cfg.trigger_mode) triggerMode.value = cfg.trigger_mode;
            if (cfg.blink_speed) {
                blinkSpeed.value = cfg.blink_speed;
                speedVal.innerText = cfg.blink_speed;
            }
            if (cfg.pattern) {
                pattern.value = cfg.pattern;
                pattern.dispatchEvent(new Event('change'));
            }
            if (cfg.custom_pattern) customPattern.value = cfg.custom_pattern;
        } catch(e) {}
    }

    if (typeof ksu === 'undefined') {
        console.warn("KernelSU API missing. Running in standard browser?");
        return;
    }
    
    // 2. Try file system sync to ensure parity
    try {
        const res = await ksu.exec(`/system/bin/cat ${configFile}`);
        if ((res.errno === 0 || res.code === 0) && res.stdout) {
            try {
                const cfg = JSON.parse(res.stdout);
                if (cfg.trigger_mode) triggerMode.value = cfg.trigger_mode;
                if (cfg.blink_speed) {
                    blinkSpeed.value = cfg.blink_speed;
                    speedVal.innerText = cfg.blink_speed;
                }
                if (cfg.pattern) {
                    pattern.value = cfg.pattern;
                    pattern.dispatchEvent(new Event('change'));
                }
                if (cfg.custom_pattern) customPattern.value = cfg.custom_pattern;
            } catch(e) {
                console.error("JSON parse failure reading file from ksu:", e);
            }
        }
    } catch (e) {
        console.error("File Read Error:", e.message);
    }
}

btn.addEventListener('click', async () => {
    const config = {
        trigger_mode: triggerMode.value,
        blink_speed: String(blinkSpeed.value),
        pattern: pattern.value,
        custom_pattern: customPattern.value
    };
    const jsonStr = JSON.stringify(config);
    
    // Guarantee WebUI continuity via localStorage
    localStorage.setItem('raphael_light_config', jsonStr);

    if (typeof ksu === 'undefined') {
        alert("State saved to WebUI memory, but KernelSU API is missing to write to system!");
        return;
    }
    
    try {
        const command = `/system/bin/echo '${jsonStr}' > ${configFile}`;
        const res = await ksu.exec(command);
        
        if (res.errno !== 0 && res.errno !== undefined) {
            alert("Failed to flash config.json! Errno: " + res.errno);
        } else if (res.code !== 0 && res.code !== undefined) {
            alert("Failed to flash config.json! Code: " + res.code);
        } else {
            alert("Settings fully Saved & Cached! Your hardware rules are active.");
        }
    } catch (e) {
        alert("Save Exception: " + e.message);
    }
});

window.onload = loadSettings;
