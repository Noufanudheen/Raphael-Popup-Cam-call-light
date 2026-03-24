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
    if (typeof ksu === 'undefined') {
        alert("KernelSU API missing.");
        return;
    }
    try {
        const res = await ksu.exec(`/system/bin/cat ${configFile}`);
        if (res.errno === 0 || res.code === 0 || res.stdout) {
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
            } catch(e) {}
        }
    } catch (e) {
        alert("Load Error: " + e.message);
    }
}

btn.addEventListener('click', async () => {
    if (typeof ksu === 'undefined') {
        alert("KernelSU API missing!");
        return;
    }
    const config = {
        trigger_mode: triggerMode.value,
        blink_speed: String(blinkSpeed.value),
        pattern: pattern.value,
        custom_pattern: customPattern.value
    };
    const jsonStr = JSON.stringify(config);
    try {
        const res = await ksu.exec(`/system/bin/echo '${jsonStr}' > ${configFile}`);
        
        if (res.errno !== 0 && res.errno !== undefined) {
            alert("Failed to save! Errno: " + res.errno);
        } else if (res.code !== 0 && res.code !== undefined) {
            alert("Failed to save! Code: " + res.code);
        } else {
            alert("Settings Saved successfully!");
        }
    } catch (e) {
        alert("Save Exception: " + e.message);
    }
});

window.onload = loadSettings;
