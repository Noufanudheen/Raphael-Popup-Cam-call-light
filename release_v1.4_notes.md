# Release v1.4

## What's New
- **Silent & Vibrate Triggers:** Choose exactly when the LED activates by explicitly targeting Silent mode, Vibrate mode, or both simultaneously (ignores generic normal ringing).
- **Dynamic Speed Slider:** Added a clean UI range slider to the KSU WebUI, enabling visual, precise millisecond targeting for your light blink pace.
- **Custom Sequence Engine:** You can now author your own exact LED on/off profiles directly from the KSU app (e.g. `300,200,300,1000`) for absolute, granular control over the hardware lighting sequence.
- **Under-the-hood Refinements:**
  - Migrated to native POSIX shell string internal-field-separating (IFS) for zero-overhead array parsing.
  - Hardened the `ksu.exec` Javascript API interface to dynamically track `errno` execution states, surfacing accurate Save feedback dialogs to the user.
  - Safely stripped out untested EvolutionX RRO layouts to completely prevent ROM overlay conflicts with The Evolver.

## Installation
1. Download `raphael_popup_cam_light_v1.4.zip` from the `releases` folder.
2. Flash it directly via the KernelSU Module Manager application on your phone.
3. Reboot to activate the hardware daemon.
4. Finalize your customized lighting timing/rules entirely via the native WebUI Dashboard integrated natively inside the KernelSU app.
