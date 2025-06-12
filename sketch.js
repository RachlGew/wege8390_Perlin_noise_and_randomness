/**
 * This is a generative artwork driven by Perlin noise.
 * It features glowing organic blobs, drifting light particles,
 * rotating radiants, and noise-based background textures.
 * Each element is animated using noise fields and time-based changes.
 */

let blobs = [], radiants = [], holes = [], sparks = [];
let bgTexture;

function setup() {
  /**
   * Step 1: Create the canvas and background texture.
   */
  createCanvas(700, 700);
  bgTexture = createGraphics(width, height);
  createTexture(bgTexture);

  /**
   * Step 2: Initialize animated elements.
   */
  for (let i = 0; i < 40; i++) blobs.push(new NoiseBlob());
  for (let i = 0; i < 25; i++) radiants.push(new Radiant());
  for (let i = 0; i < 20; i++) holes.push(new Hole());
  for (let i = 0; i < 200; i++) sparks.push(new Spark());
}
function draw() {
  /**
   * Step 3: Draw background and overlay motion blur.
   */
  image(bgTexture, 0, 0);
  fill(0, 25);
  rect(0, 0, width, height);

  /**
   * Step 4: Update and display all animated objects.
   */
  holes.forEach(h => h.show());
  blobs.forEach(b => { b.update(); b.show(); });
  radiants.forEach(r => { r.update(); r.show(); });
  sparks.forEach(s => { s.update(); s.show(); });
}
/**
 * Helper: Create subtle textured background
 */
function createTexture(g) {
  g.background(0);
  g.noStroke();
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(0.5, 2);
    let a = random(5, 15);
    g.fill(30, 20, 40, a); // Dim background specks
    g.ellipse(x, y, s);
  }
}
/**
 * Class: NoiseBlob
 * Description: Represents a pulsing organic blob with layered halos
 * and rotating rings of glowing dots, driven by Perlin noise motion.
 */
class NoiseBlob {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.rBase = random(120);
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
    // Update phase for breathing effect
    this.phase += this.speed;
    this.r = this.rBase + sin(this.phase) * (15 * this.depth);

    // Calculate motion direction using Perlin noise
    let angle = noise(this.noiseOffsetX, this.noiseOffsetY) * TWO_PI * 4;
    this.pos.add(createVector(cos(angle), sin(angle)).mult(0.5 * this.depth));

    // Advance noise offsets
    this.noiseOffsetX += this.noiseStep;
    this.noiseOffsetY += this.noiseStep;

    // Keep position within canvas
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
    this.dotPhase += this.dotSpeed;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // Use blend mode for brightening effect
    if (this.depth > 0.7) drawingContext.globalCompositeOperation = 'lighter';

    fill(this.c);
    ellipse(0, 0, this.r); // Core blob shape

    // Draw soft outer glow layers
    for (let i = 0; i < 3; i++) {
      fill(red(this.c), green(this.c), blue(this.c), alpha(this.c) * 0.3 / (i+1));
      ellipse(0, 0, this.r * 1.5 * (0.7 + i * 0.3));
    }

    // Add concentric ring outlines
    noFill();
    stroke(255, alpha(this.c) * 0.5);
    strokeWeight(0.5);
    for (let i = 0; i < 5; i++) ellipse(0, 0, this.r * (0.3 + i * 0.1));

    // Rotating dot rings (glowing orbit)
    for (let i = 1; i <= 3; i++) {
      let ringRadius = this.r * (0.4 + i * 0.3);
      for (let j = 0; j < 30 * i; j++) {
        let angle = TWO_PI * j / (30 * i) + this.dotPhase * (1 - 0.1 * i);
        let pulse = 1.5 + sin(frameCount * 0.05 + j) * 0.5;
        if (j % 2 === 0) fill(230, 150, 80, alpha(this.c) * 0.7);
        else fill(50, 80, 150, alpha(this.c) * 0.7);
        ellipse(cos(angle) * ringRadius, sin(angle) * ringRadius, pulse);
      }
    }
    pop();
  }
}

/**
 * Class: Spark
 * Description: Floating particles that simulate drifting time/light.
 * Each spark moves using noise, fades with age, and resets after its lifespan.
 */
class Spark {
  constructor() {
    this.reset();
    this.type = random() > 0.7 ? "line" : "dot";
    this.noiseScale = random(0.01, 0.05);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  reset() {
    // Randomize properties
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(0.5);
    this.size = random(1, 3);
    this.baseAlpha = random(50, 150);
    this.colorVariation = random(100);
    this.life = random(100, 500);
    this.age = 0;
  }

  update() {
    // Drift using Perlin noise
    let angle = noise(this.pos.x * this.noiseScale, this.pos.y * this.noiseScale, frameCount * 0.01) * TWO_PI * 2;
    this.vel.add(createVector(cos(angle), sin(angle)).mult(0.05));
    this.vel.limit(1);
    this.pos.add(this.vel);

    // Update age and reset if expired
    if (++this.age > this.life || !this.onCanvas()) this.reset();
  }

  onCanvas() {
    return this.pos.x > 0 && this.pos.x < width && this.pos.y > 0 && this.pos.y < height;
  }

  show() {
    let alpha = this.baseAlpha * (0.5 + 0.5 * sin(this.age * 0.05));
    let col = [255 - this.colorVariation, 215 - this.colorVariation * 0.5, 130 + this.colorVariation * 0.3];

    if (this.type === "line") {
      // Trail-like spark
      let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01) * TWO_PI;
      stroke(...col, alpha);
      strokeWeight(this.size * 0.5);
      line(this.pos.x, this.pos.y,
           this.pos.x + cos(angle) * this.size * 3,
           this.pos.y + sin(angle) * this.size * 3);
    } else {
      // Dot-style spark
      noStroke();
      fill(...col, alpha);
      ellipse(this.pos.x, this.pos.y, this.size * (1 + noise(frameCount * 0.1) * 0.5));
      fill(...col, alpha * 0.3);
      ellipse(this.pos.x, this.pos.y, this.size * 3 * (1 + noise(frameCount * 0.1 + 10) * 0.2));
    }
  }
}

/**
 * Class: Radiant
 * Description: A rotating radial element representing radiant energy.
 * Lines pulse outward with noise-based variation in angle and length.
 */
class Radiant {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = random(10, 50);
    this.n = int(random(20, 100));
    this.alpha = random(40, 120);
    this.angle = random(TWO_PI);
    this.rotSpeed = random(0.001, 0.02);
    this.lineLength = random(15, 40);
    this.depth = random(1);
    this.pulsePhase = random(TWO_PI);
    this.noiseOffset = random(1000);
  }

  update() {
    // Rotation and pulse animation
    let noiseRot = noise(this.noiseOffset) * 0.04 - 0.02;
    this.angle += this.rotSpeed * map(this.depth, 0, 1, 0.8, 1.2) + noiseRot;
    this.pulsePhase += random(0.01, 0.03);
    this.currentLength = this.lineLength * (0.8 + sin(this.pulsePhase) * 0.2);
    this.noiseOffset += 0.01;

    // Subtle drift using noise
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

    // Radiating lines with noise-driven flicker
    for (let i = 0; i < this.n; i++) {
      let a = TWO_PI * i / this.n;
      strokeWeight(map(this.depth, 0, 1, i % 5 ? 0.3 : 0.5, i % 5 ? 0.8 : 1.2));
      stroke(255, i % 5 ? 240 : 255, i % 5 ? 180 : 200, i % 5 ? strokeAlpha : strokeAlpha * 1.5);
      let noisyLength = this.currentLength * (0.9 + noise(i * 0.1, frameCount * 0.01) * 0.2);
      line(cos(a) * this.r, sin(a) * this.r, cos(a) * (this.r + noisyLength), sin(a) * (this.r + noisyLength));
    }

    // Center glow
    noStroke();
    fill(255, 240, 180, strokeAlpha * 0.5);
    ellipse(0, 0, this.r * 0.5);
    pop();
  }
}

/**
 * Class: Hole
 * Description: A small static void or core that adds visual depth.
 * Represents a memory or quiet zone in the flow.
 */
class Hole {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = random(5, 10);
    this.innerR = this.r * random(0.3, 0.7);
    this.innerColor = color(20 + random(-10, 10), 10 + random(-5, 5), 30 + random(-10, 10));
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }

  update() {
    // Subtle motion using noise
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
    fill(0);
    ellipse(0, 0, this.r * 2); // Outer dark ring
    fill(this.innerColor);
    ellipse(0, 0, this.innerR * 2); // Inner glow
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
