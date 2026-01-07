# Memory Room - Photo Reference

## Photo Frame Placement

### Wall Positions

**BACK WALL (z = 11.9)**
- Position: Center of room, facing player when entering
- Frame 1: Position (0, 7, 11.9) - Size 2.5 x 3 (MAIN/LARGEST)
  - File: a1.jpg
  - Title: "Your First Smile"
  - Description: "The moment you came into the world."

**LEFT WALL (x = -9.9)**
- Position: Left side wall (rotated 90 degrees)
- Frame 2: Position (-9.9, 8, 6) - Size 2.2 x 2.8
  - File: a2.jpg
  - Title: "Growing Up"
  - Description: "Every day has been magical."

- Frame 3: Position (-9.9, 4.5, -6) - Size 2 x 2.6
  - File: a3.jpg
  - Title: "Sweet Memories"
  - Description: "Special moments we cherish."

**RIGHT WALL (x = 9.9)**
- Position: Right side wall (rotated -90 degrees)
- Frame 4: Position (9.9, 8, 6) - Size 2.2 x 2.8
  - File: a4.jpg
  - Title: "Pure Joy"
  - Description: "You deserve all the happiness!"

- Frame 5: Position (9.9, 4.5, -6) - Size 2 x 2.6
  - File: a5.jpg
  - Title: "Happy Moments"
  - Description: "Celebrating you today!"

**FRONT WALL (z = -11.9)**
- Position: Exit wall (facing hallway)
- Frame 6: Position (-5, 6, -11.9) - Size 2 x 2.6
  - File: a6.jpg
  - Title: "Fun Times"
  - Description: "Making memories together."

- Frame 7: Position (5, 6, -11.9) - Size 2 x 2.6
  - File: a7.jpg
  - Title: "Happy Birthday!"
  - Description: "Wishing you the best!"

## Photo File Requirements

- File format: JPG or PNG
- Recommended size: 512x640 pixels (for best quality)
- Should be placed in: `c:\babi\` directory
- Files needed: a1.jpg, a2.jpg, a3.jpg, a4.jpg, a5.jpg, a6.jpg, a7.jpg

## If Image Files Don't Load

The code automatically creates placeholder canvas-based photos with:
- Gradient background (pink to blue)
- Title and description text
- Emoji icon
- Decorative border

This ensures the room is functional even without image files.

## Editing Photo Information

To change titles, descriptions, or positions:

1. Open `rooms/memory-room.js`
2. Find the `photoData` array in the `addFramedPhotos()` function
3. Modify the photo properties:
   ```javascript
   {
       pos: new THREE.Vector3(x, y, z),      // Position in 3D space
       imgFile: 'filename.jpg',                // Image file name
       title: 'Photo Title',                   // Title text
       desc: 'Description here.',              // Description text
       size: { w: 2.5, h: 3 },                // Frame width and height
       wall: 'left'                            // 'left', 'right', or undefined (back/front)
   }
   ```

4. Save and refresh the browser

## Decorations

- **Penguin**: Located at left corner (0, 0, 10)
- **Tulips**: Located at right corner (0, 0, 10)

These are added automatically and can be disabled or repositioned in the code.

