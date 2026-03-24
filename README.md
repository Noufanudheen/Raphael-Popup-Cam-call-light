# Raphael Pop-up Camera LED Controller(An AI Readme Slop)

A fully-featured KernelSU module for the Xiaomi Redmi K20 Pro / Mi 9T Pro (raphael) that dynamically controls your pop-up camera's physical LED indicators during incoming calls.

## Features
- **Trigger Modes**: Choose exactly when the LED activates (Always, Only in Silent, Only in Vibrate, or Silent & Vibrate combined).
- **Customizable Blinking**: Adjust the blink speedsecond.
- **Advanced Patterns**: Toggle between Constant Blink, Solid Light, Triple Flash, or define your own **Custom Sequence**.
- **Pure Native Execution**: Written entirely in POSIX shell script, bypassing Android framework restrictions and running efficiently as a lightweight root daemon.
- **KernelSU WebUI**: A fully integrated, standalone configuration dashboard accessible directly from the KernelSU app—no extra APKs or launchers required!

## Installation
1. Download the [File](https://github.com/Noufanudheen/Raphael-Popup-Cam-call-light/releases).
2. Flash the latest zip module.
3. Open the **KernelSU** app on your rooted device.
4. Navigate to the **Modules** tab.
5. Tap **Install** and select the downloaded zip file.
6. Reboot your device.

## Usage & Configuration
Once installed and rebooted, you don't need to dig through system settings. Simply:
1. Open the KernelSU app.
2. Go to the Modules tab and tap on **Raphael Pop-up Camera call Lightning**.
3. Tap the WebUI configuration button to open the dashboard.
4. Adjust your blink speeds, patterns, and triggers, then hit **Save Settings**.

### Custom Sequences
If you select the **Custom Sequence** pattern, you can define exact initialization states utilizing millisecond timing blocks. 
* **Format:** `ON,OFF,ON,OFF,...` 
* **Example:** `300,200,300,200,300,1000` (activates the LED for 300ms, pauses for 200ms, repeats twice more, then rests for 1000ms before looping).

## Compatibility
- Guaranteed compatible with A16 Custom ROMs (EvolutionX, LineageOS, etc.)
- Compatible with the latest KernelSU builds.

## Credits
Author: neonbox
