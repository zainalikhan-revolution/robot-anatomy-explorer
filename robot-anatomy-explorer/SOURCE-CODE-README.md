# Robot Anatomy Explorer — Source Code

Interactive educational humanoid-robot laboratory for exploring robot anatomy, hardware, action feedback loops, and virtual assembly.

Live site: https://robot-anatomy-explorer.masterkhan737.chatgpt.site

## Included

- 10 connected humanoid robot systems
- 51 hardware groups across frame, actuation, computing, sensing, power, wiring, safety/cooling, and tools
- Interactive X-ray and exploded views
- Animated wave and balance demonstrations
- Closed-loop action simulations
- Eight-stage virtual build studio

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open the local address shown by the development server.

## Production build

```bash
npm run build
```

## Important engineering note

This project teaches humanoid robot systems and assembly order. It is an educational reference architecture, not a certified mechanical, electrical, or safety design for constructing a full-size physical humanoid. A real build requires engineering calculations, component-specific limits, risk assessment, and appropriate supervision.
