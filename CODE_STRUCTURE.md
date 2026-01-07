# Birthday Experience - Code Structure

## New Modular Architecture

The code has been reorganized into separate, manageable files for easier editing and maintenance.

### File Structure

```
c:\babi\
├── index.html              (Main HTML file)
├── script.js               (Main JavaScript - core logic, hallway, interactions)
├── styles.css              (CSS styling)
├── rooms/
│   ├── memory-room.js      (Photo Gallery room)
│   ├── game-room.js        (Game room)
│   └── birthday-room.js    (Birthday celebration room)
└── (image files)
    ├── a1.jpg
    ├── a2.jpg
    ├── a3.jpg
    ├── a4.jpg
    ├── a5.jpg
    ├── a6.jpg
    └── a7.jpg
```

### How It Works

**index.html** loads the scripts in this order:
1. Three.js library (CDN)
2. `rooms/memory-room.js` - Memory/Photo Gallery functions
3. `rooms/game-room.js` - Game Room functions
4. `rooms/birthday-room.js` - Birthday Room functions
5. `script.js` - Main application logic

**script.js** contains:
- Global variables and initialization
- Main hallway creation
- Camera controls and movement
- Door interactions
- Room entry/exit logic
- Game logic
- Audio and animations
- Landing page and login interactions

**Room files** contain:
- `createPhotoRoom()` - Creates the memory/photo gallery
- `createGameRoom()` - Creates the game room
- `createBirthdayRoom()` - Creates the birthday celebration room
- Helper functions for decorations

### Memory Room Photos

The memory room displays photos on 7 picture frames:
- **Back wall (main)**: 1 large frame (2.5x3)
- **Left wall**: 2 frames (2.2x2.8 and 2x2.6)
- **Right wall**: 2 frames (2.2x2.8 and 2x2.6)
- **Front wall (near exit)**: 2 frames (2x2.6 each)

**Photo loading:**
- The code attempts to load actual image files (a1.jpg through a7.jpg)
- If images aren't found, it creates placeholder canvases with text and emojis
- Photos are positioned and rotated correctly for each wall

### Making Changes

**To edit the Memory Room:**
- Edit `rooms/memory-room.js`
- Change photo positions, sizes, or decorations
- No need to reload the entire script

**To edit the Game Room:**
- Edit `rooms/game-room.js`
- Modify colors, decorations, or layout

**To edit the Birthday Room:**
- Edit `rooms/birthday-room.js`
- Adjust balloons, cake, or lighting

**To edit core logic:**
- Edit `script.js`
- Change camera controls, interactions, or game logic

### Important Notes

1. **Image Files**: Place your photo files (a1.jpg through a7.jpg) in the c:\babi\ directory
2. **Lighting**: Each room is re-lit when entered to ensure proper visibility
3. **Camera Boundaries**: Each room has collision boundaries to keep the player in bounds
4. **Exit Points**: Press SPACE near the front wall to return to the hallway

