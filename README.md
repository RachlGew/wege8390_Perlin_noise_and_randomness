# Generative Perlin Wheel: Animated Abstract Visualization

## How to Interact
1. Open the project in Visual Studio Code.
2. Load the `index.html` file and choose 'Open with Live Server'
3. The animation will start automatically—there is no interaction required.
4. Watch as the screen slowly transforms with organic movement driven by Perlin noise.

## Individual Approach

I chose **Perlin noise and random** to drive my animation. This creates smooth, natural transitions. It gives the composition a soft, breathing motion that evolves continuously.

### Unique Animation Technique

- My primary focus was the **radial dot rings** that animate around each Perlin blob.
- These dot rings pulse and rotate independently using trigonometric functions and internal phase shifts.
- This creates a “wheel of dots” effect that sets my work apart from others in the group.

### Animated Properties

- **Blob shape and radius** change with sine waves and Perlin noise.
- **Rings of animated dots** orbit around each blob and pulse over time.
- **Blending mode (`lighter`)** is selectively used to enhance glow effects.
- **Sparks** and other elements move with subtle noise-based motion.

## Visual Inspiration

- Yayoi Kusama’s dotted patterns
- Pacita Abad's 'Wheels of fortune'

These inspired me to create something meditative, luminous, and layered.

## Technical Details
Each `NoiseBlob` object has:
- A base radius that changes with sine waves.
- A dot ring system that creates 3 concentric rings using `cos()` and `sin()` calculations.
- The dot rings animate by using `frameCount` and individual `dotPhase` values.

```js
for (let i = 1; i <= 3; i++) {
  let ringRadius = this.r * (0.4 + i * 0.3);
  for (let j = 0; j < 30 * i; j++) {
    let angle = TWO_PI * j / (30 * i) + this.dotPhase * (1 - 0.1 * i);
    let pulse = 1.5 + sin(frameCount * 0.05 + j) * 0.5;
    ellipse(cos(angle) * ringRadius, sin(angle) * ringRadius, pulse);
  }
}
