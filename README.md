# Generative Perlin Wheel: "Shimmering Life Layers" 
This project is a generative art work implemented using p5.js, inspired by Yayoi Kusama's Polka Dot Art and Pacita Abad's Wheels of Fortune. The work drives multiple visual elements through Perlin noise, making them flow, breathe, and glow in the picture, creating a dynamic picture with a sense of meditation, rhythm, and depth.

---

## Interaction Instructions
There are **no required interactions** — just open the page and let the animation evolve:
1. Open project in **Visual Studio Code**  
2. Right-click `index.html` → **Open with Live Server**  
3. Animation auto-plays upon loading  
4. Observe organic evolution: forms continuously generate, grow, and fade  

---

## Individual Approach

This work is a generative animation based on **Perlin noise** and **randomness**, exploring the visual metaphor of ‘life, time and memory’. The elements in the image are like free-floating particles, a growing energy field and a sedimentary layer of memories, which together form a static and dynamic life system.

### Perlin Noise Animation System
The entire animation system is designed around **Perlin noise**, which I used to:

- Control the organic motion of all elements
- Create smooth pulsation and rotation
- Generate coherent background texture
- Introduce subtle variation in glow, timing, and drift

### Unique Animation Strategy

While the `Spark`, `NoiseBlob`, and other elements were part of our group codebase, I made substantial structural and expressive refinements in my personal version:

### 1. Custom Redesign of the `Spark` Particle System

- I adjusted the **noise-driven movement logic** and **life cycle oscillation**.
- Sparks now include two distinct types (lines/dots), each rendered with glow and fade.
- Motion is smoothed, and **alpha flickering** is introduced to simulate breathing/starlight.

### 2. Enhanced `NoiseBlob` with Layered Glow + Halo Rings

- I added **multi-ring halos**, **rotating dot rings**, and **sin+noise pulsing**.
- The blob behaves more like a living organism, with breathing-like expansion and particle orbit.
- Glow mode `lighter` is used strategically to enhance depth.

### 3. Fully Unified Perlin Noise System

- Every element—including background, sparks, blobs, and even static holes—has Perlin-driven animation or offset.
- This achieves a consistent aesthetic and sense of motion across the canvas.

### 4. Textural Background Rework

- I rebuilt the `createTexture()` function to include:
  - Fine noise-dispersed grain
  - Directional strokes that suggest sediment, time, or cosmic fog

---

## Visual Inspiration

- Yayoi Kusama’s dotted patterns ![Yayoi Kusama’s dotted patterns](images/PolkaDotInstallation.jpg)

- Pacita Abad's 'Wheels of fortune' ![Pacita Abad's 'Wheels of fortune'](images/Pacita-Abad-Wheels-of-fortune.jpg)

These visual references inspired me to create an animation that is **meditative**, **luminous**, and **layered**.
I was particularly drawn to the repetitive dot structures and vibrant radial arrangements, which influenced the use of **Perlin-noise-driven rings**, **pulsing textures**, and **organic movement** in my generative work.

---

## Technical Implementation

- Use `createGraphics()` to implement separate background layers;
- Introduced `globalCompositeOperation = “lighter”` for more realistic light overlays;
- Dynamic tempo control is based on `frameCount`, combined with `noise()` and `sin()` for local and global linkage;
- All classes have independent `update()` and `show()` methods, the code structure is clear and easy to extend.

---

## External References / Techniques

- Comments for all key functions and classes are kept and extended in my code;
- Function descriptions are provided for external techniques used (e.g. Perlin noise control);
- Background textures and particle behaviours are referenced from official p5.js examples and Coding Train tutorials, and are referenced in the comments.

### OpenProcessing Reference
[Perlin Noise OpenProcessing Reference](images/openprocessing.gif)
Source: https://openprocessing.org/sketch/2064890

[Perlin Noise OpenProcessing Reference](images/blueperlinnoise.gif)
Source: https://openprocessing.org/sketch/2018713

- Inspired glowing orbiting particles and central radial lines.
- Adapted techniques for rotating dot rings and smooth light trails.

---

## Conclusion
This is a generative artwork constructed in code, fusing rhythmic, breathing, spatial and conceptual metaphors. Through the full application of **Perlin Noise Technology**, I have constructed a dynamic and organic visual field of life that expresses my understanding of the cycles of time, memory and fate.