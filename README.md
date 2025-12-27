
# Rubik's Cube 3D

An interactive, visually stunning 3D Rubik's Cube web app built with Three.js. Features a modern UI, smooth animations, and a beautiful 3D bevel cube design. Easily shuffle, solve, and manually rotate layers—with clear highlights showing which cubies are affected by each move.


## Features
- Gorgeous 3D bevel cube design (stickers look raised with shadow and highlight)
- Drag to rotate the cube in 3D
- Shuffle and auto-solve buttons
- Manual rotation controls for each layer and axis
- Zoom in/out controls
- Visual highlight of affected cubies for each move (remains until next move)
- Responsive, modern UI with smooth transitions


## Getting Started
1. **Start a local server in the project folder:**
   - Python: `python3 -m http.server`
   - Node.js: `npx serve`
2. **Open your browser to** `http://localhost:8000` (or the port shown)
3. **Enjoy the interactive cube!**


## How to Play

### Controls Overview

- **Rotate the cube:** Drag with your mouse to view from any angle.
- **Zoom In/Out:** Use the + and − buttons on the left side.
- **Shuffle:** Click Shuffle to randomize the cube.
- **Solve:** Click Solve to automatically restore the cube to its solved state.
   - The Solve button reverses all moves made since the last shuffle or solve. It animates each reversal so you can watch the cube return to its solved state. (No algorithmic solution—just a visual undo of your moves.)

### Manual Rotation Buttons

Located in the bottom right panel, these buttons rotate specific layers:

| Button | Axis | Layer | Direction | Description |
|--------|------|-------|-----------|-------------|
| L      | Y    | Left  | CW        | Rotate left layer (Y axis, -1) |
| M      | Y    | Middle| CW        | Rotate middle layer (Y axis, 0) |
| R      | Y    | Right | CCW       | Rotate right layer (Y axis, +1) |
| U      | X    | Up    | CCW       | Rotate top layer (X axis, -1) |
| E      | X    | Middle| CW        | Rotate middle layer (X axis, 0) |
| D      | X    | Down  | CW        | Rotate bottom layer (X axis, +1) |
| F      | Z    | Front | CW        | Rotate front layer (Z axis, -1) |
| S      | Z    | Middle| CW        | Rotate middle layer (Z axis, 0) |
| B      | Z    | Back  | CCW       | Rotate back layer (Z axis, +1) |

**Tip:** When you click a rotation button, the affected cubies are highlighted with a soft color until your next move—making it easy to see which part of the cube is changing.

### Example Play

1. Shuffle the cube with the Shuffle button.
2. Rotate layers manually using the rotation buttons.
3. Click Solve to watch the cube animate back to its solved state, undoing all your moves.

## File Structure
- `rubik.html` — Main HTML file (includes import map for Three.js)
- `main.js` — All Rubik's Cube logic, rendering, and animation
- `style.css` — UI and layout styles


## Technology
- [Three.js](https://threejs.org/) (via CDN import map)
- Modern ES modules
- No build step required


## Customization
- Change cube colors in `main.js` (`COLORS` object)
- Tweak UI styles in `style.css`
- Redesign sticker bevels in `main.js` (see `createStickerTexture`)
- Add new features by editing `main.js`


## Troubleshooting
- **If you see nothing:** Make sure you are running a local server, not opening the HTML file directly.
- **If you see import errors:** Ensure the `<script type="importmap">` is present in `rubik.html`.
- **If you see WebSocket/401 errors:** Ignore them; they are from VS Code Live Preview, not your app.


## License
MIT
