# GearSwap Studio
![Build Status](https://github.com/GCarman1982/Development/actions/workflows/gearswap-ui.yml/badge.svg)

GearSwap Studio is a modern, standalone desktop application designed to simplify the creation and management of GearSwap files for Final Fantasy XI (FFXI). It provides a sleek, visual, and interactive way to build gear sets, manage complex job-specific equipment configurations, and seamlessly export your setups directly into functional, ready-to-use Lua scripts—no coding experience necessary.

## Features Overview

### Import Existing Lua Files
Got an existing GearSwap `.lua` file? No need to start from scratch! GearSwap Studio can import your current files, automatically parsing your sets, character name, and job. This allows you to visually edit your gear and export it back without losing your custom logic or variables.

### Visual Gear Slot Configurations
Interact with a full grid representing your character's equipment slots to easily equip the right gear for the right situation. 

![Main Interface](./assets/main_interface.png)

### Intelligent Item Selector
Instantly search through an integrated database to quickly find items by name, updating your setup seamlessly.

![Item Selector](./assets/item_selector.png)

### Dynamic Lua Generation
As you construct your sets, the app generates the precise Lua code required for your GearSwap scripts automatically. It updates in real-time as you switch gear, and even tracks your manual variations.

![Live Lua Code Block Updates](./assets/lua_live_update.png)

### Theming
Comfortably use the app in varied lighting conditions with built-in Light and Dark mode themes, or enjoy a blast from the past with the Classic FFXI theme.

#### Modern Dark
![Dark Theme Interface](./assets/dark_theme_interface.png)

#### Classic FFXI
![Classic FFXI Theme](./assets/ffxi_theme.png)

## User Guide
For a comprehensive walkthrough on how to use the GearSwap Studio, please refer to the [User Manual](./user_manual.md).

## Installation & Updates

1. Download the latest `GearSwapStudio-Setup-vX.X.X.exe` from the [GitHub Releases](https://github.com/GCarman1982/FFXI-Development/releases) page.
2. Run the installer to add GearSwap Studio to your system.
3. **Updates**: GearSwap Studio will notify you when a new version is available! Simply click the **Update** button (Refresh icon) in the top navigation bar to check for and download future updates manually.

## Development

If you wish to build the application from source:

1. Install dependencies: `npm install`
2. Run the development environment: `npm run dev`
3. Build the executable installer: `npm run build`

---
*Created by Quishwar*
