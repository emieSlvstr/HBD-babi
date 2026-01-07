# How to Run the Birthday Experience

This is a 3D web application built with Three.js. You need to serve it through a local web server (not just open the HTML file directly).

## Quick Start Options

### Option 1: Python HTTP Server (Easiest)

If you have Python installed:

**Python 3:**
```bash
cd c:\babi
python -m http.server 8000
```

**Python 2:**
```bash
cd c:\babi
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: **http://localhost:8000**

---

### Option 2: Node.js HTTP Server

If you have Node.js installed:

1. Install http-server globally (one-time):
```bash
npm install -g http-server
```

2. Run the server:
```bash
cd c:\babi
http-server -p 8000
```

Then open: **http://localhost:8000**

---

### Option 3: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

### Option 4: Any Other HTTP Server

You can use any simple HTTP server:
- **PHP**: `php -S localhost:8000`
- **Ruby**: `ruby -run -e httpd . -p 8000`
- Or any other local server tool

---

## Controls

Once running:
- **WASD** or **Arrow Keys**: Move around
- **Mouse**: Look around
- **SPACE**: Interact with doors/objects
- **Mobile**: Virtual joystick for movement

---

## Troubleshooting

- **Images not loading?** Make sure all image files (a1.jpg through a14.jpg) are in the `c:\babi\` directory
- **CORS errors?** You MUST use a web server, not just open the HTML file directly
- **Port 8000 in use?** Use a different port (e.g., 8080, 3000)

---

## Files Structure

```
c:\babi\
├── index.html              (Main entry point)
├── script.js               (Core logic)
├── styles.css              (Styling)
├── rooms/
│   ├── memory-room.js      (Photo gallery)
│   ├── game-room.js        (Games)
│   └── birthday-room.js    (Celebration)
└── a1.jpg - a14.jpg        (Photos)
```
