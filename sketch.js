/**
 * Generative Life Artwork - Scales with window size
 * 
 * This artwork simulates the metaphorical passage of life using four key visual components:
 * - NoiseBlob: Floating fog-like glowing masses representing the flow of time and breath.
 * - Radiant: Rotating energy rays symbolizing vitality or moments of clarity.
 * - Hole: Black voids that suggest memory loss, absence, or emotional gaps.
 * - Spark: Flickering particles that drift and vanish, symbolizing fleeting memories or events.
 * 
 * All components are animated independently using Perlin noise, sine waves, and random behavior.
 * The sketch is responsive and adapts to any browser window size using normalized coordinates.
 *
 * Each class stores normalized coordinates (0.0 - 1.0) for scale-safe layout,
 * and then calculates its pixel positions based on the canvas dimensions.
 */

let blobs = [], radiants = [], holes = [], sparks = [];
let bgTexture; // Off-screen buffer for persistent background grain and line texture

function setup() {
  /**
   * Step 1: Setup and Initialization
   * - Create a canvas that fills the window.
   * - Initialize an off-screen graphics buffer.
   * - Generate the four types of visual components.
   */
  createCanvas(windowWidth, windowHeight);
  background(0); // Ensure clean black background
  noStroke();     // Disable outlines globally for cleaner visuals

  bgTexture = createGraphics(width, height); // Create off-screen texture layer
  createTexture(bgTexture);                 // Populate buffer with grain and line texture

  // Instantiate all elements with randomized positions
  for (let i = 0; i < 60; i++) blobs.push(new NoiseBlob());
  for (let i = 0; i < 25; i++) radiants.push(new Radiant());
  for (let i = 0; i < 20; i++) holes.push(new Hole());
  for (let i = 0; i < 200; i++) sparks.push(new Spark());
}

function draw() {
  /**
   * Step-by-step rendering pipeline
   * - Static background texture
   * - Semi-transparent overlay for motion trails
   * - Depth-ordered rendering of animated elements
   */

  // Step 1: Draw the pre-generated background texture
  image(bgTexture, 0, 0);

  // Step 2: Overlay a low-opacity black rectangle to create ghosting/motion blur
  fill(0, 25);
  rect(0, 0, width, height);

  // Step 3: Render 'Hole' elements — these black voids stay mostly static
  for (let h of holes) h.show();

  // Step 4: Animate and render 'NoiseBlob' — soft glowing blobs
  for (let b of blobs) {
    b.update();
    b.show();
  }

  // Step 5: Animate and render 'Radiant' — rotating spiky light bursts
  for (let r of radiants) {
    r.update();
    r.show();
  }

  // Step 6: Animate and render 'Spark' — glowing drifting particles
  for (let s of sparks) {
    s.update();
    s.show();
  }
}

function windowResized() {
  /**
   * Ensures that all components properly scale and reposition when the window changes size.
   */
  resizeCanvas(windowWidth, windowHeight);
  bgTexture = createGraphics(width, height);
  createTexture(bgTexture);

  // Recalculate element positions and sizes using stored normalized coordinates
  for (let b of blobs) {
    b.pos.x = b.normX * width;
    b.pos.y = b.normY * height;
    b.rBase = b.rBaseOriginal * min(width, height) / 900;
  }
  for (let r of radiants) {
    r.x = r.normX * width;
    r.y = r.normY * height;
    r.r *= min(width, height) / 900;
    r.lineLength *= min(width, height) / 900;
  }
  for (let h of holes) {
    h.x = h.normX * width;
    h.y = h.normY * height;
    h.r *= min(width, height) / 900;
    h.innerR *= min(width, height) / 900;
  }
  for (let s of sparks) {
    s.x = s.normX * width;
    s.y = s.normY * height;
  }
}

function createTexture(g) {
  /**
   * Create static background texture:
   * - Random dots for noise
   * - Soft diagonal lines for depth
   */
  g.background(0);
  g.noStroke();

  // Grainy particles
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(0.5, 2);
    let a = random(5, 15);
    g.fill(30, 20, 40, a); // Dim purple-colored dots
    g.ellipse(x, y, s);
  }

  // Subtle scratch lines for visual layering
  g.stroke(40, 30, 50, 10);
  for (let i = 0; i < 50; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-100, 100);
    g.line(x1, y1, x2, y2);  // Adds imperfection, evokes aged memory
  }
}

// NoiseBlob: Glowing fog-like entity animated with Perlin noise and pulsing size
/**
 * Class: NoiseBlob
 * Description:
 *   Represents a soft, glowing, fog-like entity that floats across the screen
 *   using Perlin noise for organic motion. It breathes by pulsating in size and
 *   contains layered halos and orbiting dots to simulate visual depth and life cycles.
 *   Normalized coordinates are stored for responsive scaling.
 */
class NoiseBlob {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.normX = this.pos.x / width;
    this.normY = this.pos.y / height;
    this.rBase = random(120);
    this.rBaseOriginal = this.rBase; // Store original size for scaling
    this.phase = random(TWO_PI);
    this.speed = random(0.003, 0.01);
    this.c = color(230 + random(-20, 20), 160 + random(-30, 30), 140 + random(-50, 50), random(30, 120));
    this.depth = random(1);
    this.dotPhase = random(TWO_PI);
    this.dotSpeed = random(0.005, 0.02);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.noiseStep = 0.01;
  }

  update() {
    this.phase += this.speed;
    this.r = this.rBase + sin(this.phase) * (15 * this.depth);
    let angle = noise(this.noiseOffsetX, this.noiseOffsetY) * TWO_PI * 4;
    this.pos.add(createVector(cos(angle), sin(angle)).mult(0.5 * this.depth));
    this.noiseOffsetX += this.noiseStep;
    this.noiseOffsetY += this.noiseStep;
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
    this.dotPhase += this.dotSpeed;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.depth > 0.7) drawingContext.globalCompositeOperation = 'lighter';
    fill(this.c);
    ellipse(0, 0, this.r);
    for (let i = 0; i < 3; i++) {
      fill(red(this.c), green(this.c), blue(this.c), alpha(this.c) * 0.3 / (i + 1));
      ellipse(0, 0, this.r * 1.5 * (0.7 + i * 0.3));
    }
    noFill();
    stroke(255, alpha(this.c) * 0.5);
    strokeWeight(0.5);
    for (let i = 0; i < 5; i++) ellipse(0, 0, this.r * (0.3 + i * 0.1));
    for (let i = 1; i <= 3; i++) {
      let ringRadius = this.r * (0.4 + i * 0.3);
      for (let j = 0; j < 30 * i; j++) {
        let angle = TWO_PI * j / (30 * i) + this.dotPhase * (1 - 0.1 * i);
        let pulse = 1.5 + sin(frameCount * 0.05 + j) * 0.5;
        fill(j % 2 === 0 ? color(230, 150, 80, alpha(this.c) * 0.7) : color(50, 80, 150, alpha(this.c) * 0.7));
        ellipse(cos(angle) * ringRadius, sin(angle) * ringRadius, pulse);
      }
    }
    pop();
  }
}

/**
 * Class: Spark
 * Description:
 *   Small drifting particles that flicker and fade, representing fleeting memories or moments.
 *   Movement is controlled by Perlin noise and each has a limited lifespan before being reset.
 *   Can appear as a glowing dot or a short line (trail).
 */
class Spark {
  constructor() {
    this.reset(); // Initialize with random position and properties
    this.type = random() > 0.7 ? "line" : "dot";
    this.noiseScale = random(0.01, 0.05); // Scale for Perlin noise influence
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(0.5); // Initial small movement
    this.size = random(1, 3);
    this.baseAlpha = random(50, 150); // Controls flicker strength
    this.colorVariation = random(100); // Slight hue shifting per spark
    this.life = random(100, 500); // Particle lifetime
    this.age = 0;
  }

  update() {
    let angle = noise(this.pos.x * this.noiseScale, this.pos.y * this.noiseScale, frameCount * 0.01) * TWO_PI * 2;
    this.vel.add(createVector(cos(angle), sin(angle)).mult(0.05)); // Direction nudging
    this.vel.limit(1); // Limit speed to prevent excessive drift
    this.pos.add(this.vel);
    if (++this.age > this.life || !this.onCanvas()) this.reset(); // Reset when expired or off-screen
  }

  onCanvas() {
    return this.pos.x > 0 && this.pos.x < width && this.pos.y > 0 && this.pos.y < height;
  }

  show() {
    let alpha = this.baseAlpha * (0.5 + 0.5 * sin(this.age * 0.05));
    let col = [255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3];
    if (this.type === "line") {
      // Draw as a flickering line
      let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01) * TWO_PI;
      stroke(...col, alpha);
      strokeWeight(this.size * 0.5);
      line(this.pos.x, this.pos.y, this.pos.x + cos(angle) * this.size * 3, this.pos.y + sin(angle) * this.size * 3);
    } else {
      // Draw as a glowing dot
      noStroke();
      fill(...col, alpha);
      ellipse(this.pos.x, this.pos.y, this.size * (1 + noise(frameCount * 0.1) * 0.5));
      
      // Soft outer aura
      fill(...col, alpha * 0.3);
      ellipse(this.pos.x, this.pos.y, this.size * 3 * (1 + noise(frameCount * 0.1 + 10) * 0.2));
    }
  }
}

/**
 * Class: Radiant
 * Description:
 *   Radiating light bursts that rotate and pulse. They consist of many outward-pointing lines
 *   that appear to flicker. The structure rotates and varies its line length over time.
 *   Used to represent energy or epiphanies in the visual metaphor.
 */
class Radiant {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = random(10, 50); // Radius of center zone
    this.n = int(random(20, 100)); // Number of rays
    this.alpha = random(40, 120); // Base opacity
    this.angle = random(TWO_PI); // Rotation angle
    this.rotSpeed = random(0.001, 0.02); // Speed of rotation
    this.lineLength = random(15, 40); // Length of each ray
    this.depth = random(1); // For z-depth sorting or visual layering
    this.pulsePhase = random(TWO_PI); // Used to animate length pulsing
    this.noiseOffset = random(1000); // NEW: Adds slight jitter to rotation
  }

  update() {
    let noiseRot = noise(this.noiseOffset) * 0.04 - 0.02; // Subtle noise-based rotation jitter
    this.angle += this.rotSpeed * map(this.depth, 0, 1, 0.8, 1.2) + noiseRot; 
    this.pulsePhase += random(0.01, 0.03); // Pulsing speed
    this.currentLength = this.lineLength * (0.8 + sin(this.pulsePhase) * 0.2); // Pulsing effect
    this.noiseOffset += 0.01;
    // Slight drifting motion
    let n = noise(this.noiseOffset * 2) * TWO_PI;
    this.pos.add(createVector(cos(n), sin(n)).mult(0.1 * this.depth));
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    let strokeAlpha = this.alpha * map(this.depth, 0, 1, 0.7, 1);
    for (let i = 0; i < this.n; i++) {
      let a = TWO_PI * i / this.n;
      strokeWeight(map(this.depth, 0, 1, i % 5 ? 0.3 : 0.5, i % 5 ? 0.8 : 1.2));
      stroke(255, i % 5 ? 240 : 255, i % 5 ? 180 : 200, i % 5 ? strokeAlpha : strokeAlpha * 1.5);
      let noisyLength = this.currentLength * (0.9 + noise(i * 0.1, frameCount * 0.01) * 0.2);
      line(cos(a) * this.r, sin(a) * this.r, cos(a) * (this.r + noisyLength), sin(a) * (this.r + noisyLength));
    }
    // Soft glowing core
    noStroke();
    fill(255, 240, 180, strokeAlpha * 0.5);
    ellipse(0, 0, this.r * 0.5);
    pop();
  }
}

/**
 * Class: Hole
 * Description:
 *   Represents a visual void or memory gap. Dark circular regions with an inner glow.
 *   Moves subtly using Perlin noise to simulate quiet, static gravity wells.
 *   Adds visual silence and contrast to the composition.
 */
class Hole {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = random(5, 10); // Outer radius
    this.innerR = this.r * random(0.3, 0.7); // Inner brighter core
    this.innerColor = color(20 + random(-10, 10), 10 + random(-5, 5), 30 + random(-10, 10));
    // Deep purple tone for subtle inner glow
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  update() {
    let n = noise(this.noiseOffsetX, this.noiseOffsetY) * TWO_PI;
    this.pos.add(createVector(cos(n), sin(n)).mult(0.05));
    this.noiseOffsetX += 0.005;
    this.noiseOffsetY += 0.005;
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(0, 50); // Slightly transparent black for depth
    fill(0);
    ellipse(0, 0, this.r * 2);
    // Inner glowing core
    fill(this.innerColor);
    ellipse(0, 0, this.innerR * 2);
    // Subtle outer glow 
    // Accent highlight to imply depth
    fill(60, 50, 80, 100);
    ellipse(this.r * 0.2, -this.r * 0.2, this.r * 0.3);
    pop();
  }
}

/**
 * Code References:
 *
 * - The Perlin noise particle system logic was inspired by examples from The Coding Train:
 *   https://www.youtube.com/watch?v=BjoM9oKOAKY
 *
 * - Rotating and pulsing visuals (e.g. NoiseBlob, Radiant) were developed using ideas from p5.js documentation:
 *   https://p5js.org/reference/#/p5/noise
 *
 * - Some canvas rendering settings (e.g. globalCompositeOperation = 'lighter') are based on MDN Canvas API docs:
 *   https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 *
 * All visual logic, design structure, and extended animation behaviors were custom designed for this personal work.
 */
