let snowflakes = [];
let globeCenterX, globeCenterY, globeRadius;
let tiltX = 0, tiltY = 0, maxTilt = 0.2;
let isSnowing = true;
let zoom = 1; // Default zoom level
let zoomMin = 0.5, zoomMax = 2; // Zoom constraints
let currentScene = 1; // Scene tracker
let buttons = []; // Scene buttons
let noiseOffset = 0.0; // Noise offset for Northern Lights
let colors 
let stars = []; // Array to store star positions
let video; // Video element
let videoPlaying = false; // Track video state
let playButton; // Button to play video
let exhaustParticles = []; // For car exhaust
let bounceOffset = 0;
let wheelRotation = 0;
let rockOffset = 0;
let mistParticles = []; // Array to store mist particles
let shootingStars = []; // Array to store active shooting stars
let lastShootingStarTime = 0; // Time tracker for rare intervals
let shootingStarInterval = 5000; // Minimum interval (5 seconds)
let notes = []; // Array to store falling notes
let noteSpeed = 2; // Speed of falling notes
let score = 0; // Player's score
let gameStarted = false; // Game state
let music; // Background music
let isSnowFalling = false; // Snowfall is inactive at first
let hitZoneY = globeCenterY + globeRadius * 0.5;
let hitWindow = 20; // Acceptable range for a "hit" around this line
let feedbacks = []; // Array to store hit/miss feedback messages
let combo = 0;       // Current combo streak
let maxCombo = 0;    // Highest combo streak
let glitterStars = []; // Array to store glittery stars


function preload() {
  // Load the music file
  music = loadSound("music.mp3"); // Replace with your file path, e.g., "assets/music/music.mp3"
}


function setup() {
  createCanvas(600, 600);
  globeCenterX = width / 2;
  globeCenterY = height / 2;
  globeRadius = 150;
  createGUI(); // Create buttons for scene selection
  resetSnowflakes(200); // Start with 200 snowflakes
  initializeStars(50); // Twinkling stars
  noStroke();
  
 // Calculate hit zone Y after initialization
  hitZoneY = globeCenterY + globeRadius * 0.5;
  
initializeGlitterStars(100); // Adjust the number as needed


  // Initialize colors for Northern Lights
  colors = [
    color(50, 220, 255, 80),
    color(50, 255, 180, 70),
    color(50, 255, 150, 60),
    color(100, 200, 255, 90),
    color(120, 180, 250, 70),
    color(150, 255, 200, 50),
    color(180, 250, 255, 80)
  ];

  // Load the video
  video = createVideo("your-video.mp4", videoLoaded);
  video.hide(); // Hide default video element

  createCanvas(600, 600);
  globeCenterX = width / 2;
  globeCenterY = height / 2;
  globeRadius = 150;

  createGUI();
  resetSnowflakes(200);
  initializeStars(50);
  noStroke();
  
  
}

function videoLoaded() {
  console.log("Video loaded!");
}

function draw() {
  setSceneBackground(currentScene); // Set the background for the current scene
  updateTilt(); // Update tilt based on mouse position

  // Zoom and draw the globe
  push();
  translate(width / 2, height / 2);
  scale(zoom);
  translate(-width / 2, -height / 2);
  drawSnowGlobe();

if (isSnowFalling && currentScene === 1) {
  drawSnowflakes();
}

  pop();

  drawGUI(); // Draw the GUI
    if (currentScene === 3) {
    updateCarAnimations();
  }
  if (currentScene === 4 && !gameStarted) {
  startRhythmGame();
}

if (currentScene === 4) {
  drawNotes();
  drawHitZoneLine();
  drawFeedbacks();
  drawScore();
}

}

function setSceneBackground(scene) {
  if (scene === 1) {
    background(20, 20, 50); // Dark Blue
  } else if (scene === 2) {
  background(124, 88, 26); // Clay color (brownish-orange)

  } else if (scene === 3) {
    background(20, 20, 20); // Bright Red
  } else if (scene === 4) {
    background(205, 113, 123); // Light Pink
  }
}


function drawSnowGlobe() {
  push();
  translate(globeCenterX, globeCenterY);

  // Clip elements within the globe
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(0, 0, globeRadius, 0, Math.PI * 2);
  drawingContext.clip();

  drawRadialGradient(0, 0, globeRadius);
  drawGlassShading();

  // Draw snowy base for all scenes except Scene 1
  if (currentScene !== 1) {
    drawSnowyBase();
  }

  // Scene-specific elements
  if (currentScene === 1) {
    drawTwinklingStars();
    drawBuilding(-100, -40, 0.5);
  } else if (currentScene === 2) {
    drawTwinklingStars();
    drawNorthernLights();
    updateMistParticles(); // Add mist effect in Scene 2
  } else if (currentScene === 3) {
    drawTwinklingStars();
    drawMovieScreen(); // Scene 3: Display movie screen
    drawCarInGlobe(0, globeRadius * 0.4, 0.3); }// Scene 3: Car inside the globe
    else if (currentScene === 4) {
    drawGlitterStars(); // Add glittery stars in Scene 4
    drawNotes(); // Rhythm game
      
  startRhythmGame(); // Start rhythm game
  drawNotes(); // Draw falling notes



}

  // Shooting stars for Scenes 1, 2, and 3
  if (currentScene === 1 || currentScene === 2 || currentScene === 3) {
    updateShootingStars();
    if (millis() - lastShootingStarTime > shootingStarInterval) {
      if (random() < 0.3) { // 30% chance to spawn a shooting star
        spawnShootingStar();
        lastShootingStarTime = millis(); // Reset timer
        shootingStarInterval = random(5000, 15000); // Randomize next interval (5-15 seconds)
      }
    }
  }

  drawingContext.restore();

  drawHighlights();
  drawWoodenBase();
  pop();
}
function initializeGlitterStars(count = 100) {
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let radius = random(globeRadius * 0.8);
    glitterStars.push({
      angle: angle,
      radius: radius,
      size: random(3, 6),
      color: random() < 0.5 ? color(255, 182, 193) : color(192, 192, 192),
      twinkleOffset: random(TWO_PI),
      speed: random(0.01, 0.03),
    });
  }
  console.log("Stars initialized: ", glitterStars.length); // Debug line

  }

function drawGlitterStars() {
  push();
  translate(globeCenterX, globeCenterY); // Center in the globe
  noStroke();

  for (let star of glitterStars) {
    // Update swirling position
    star.angle += star.speed; // Swirl
    let x = cos(star.angle) * star.radius;
    let y = sin(star.angle) * star.radius;

    // Twinkle effect
    let brightness = map(sin(frameCount * 0.1 + star.twinkleOffset), -1, 1, 150, 255);
    fill(red(star.color), green(star.color), blue(star.color), brightness);

    // Draw the star
    ellipse(x, y, star.size);
  }
  pop();
}
function startSnowfall() {
  if (!isSnowFalling) {
    isSnowFalling = true;

    // Apply a small downward force to all snowflakes to start motion
    for (let flake of snowflakes) {
      flake.applyForce(createVector(0, random(0.1, 0.3))); // Small downward push
    }
  }
}

// Function to create a new shooting star
function spawnShootingStar() {
  let startX = random(-globeRadius, globeRadius);
  let startY = random(-globeRadius * 0.8, -globeRadius * 0.5); // Upper part of the globe
  let velocity = createVector(random(3, 6), random(1, 3)); // Diagonal movement
  let life = 100; // How long the star lasts (frames)

  shootingStars.push({
    x: startX,
    y: startY,
    velocity: velocity,
    life: life,
  });
}

// Function to update and display shooting stars
function updateShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let star = shootingStars[i];

    // Update position
    star.x += star.velocity.x;
    star.y += star.velocity.y;
    star.life -= 2; // Reduce life

    // Display shooting star
    push();
    stroke(255, 255, 255, map(star.life, 0, 100, 0, 255)); // Fade out over time
    strokeWeight(2);
    line(star.x, star.y, star.x - star.velocity.x * 5, star.y - star.velocity.y * 5); // Draw trail
    pop();

    // Remove if the shooting star is "dead"
    if (star.life <= 0) {
      shootingStars.splice(i, 1);
    }
  }
}

function drawNorthernLights() {
  if (!colors) return; // Exit if colors are not initialized

  noiseOffset += 0.01; // Increment noise offset for motion
  let numStrips = 12; // Number of aurora strips
  let stripWidth = 40; // Adjust strip width for scale

  for (let i = 0; i < numStrips; i++) {
    let xOffset = i * stripWidth - globeRadius * 0.9; // Position strips inside the globe
    let noiseStart = noiseOffset + i * 0.4;
    let stripColor = colors[i % colors.length];
    drawWavyStrip(xOffset, stripWidth, noiseStart, stripColor);
  }
}

function initializeStars(count = 50) {
  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(-globeRadius * 0.8, globeRadius * 0.8),
      y: random(-globeRadius * 0.8, 0), // Limit stars to the upper part of the globe
      brightnessOffset: random(TWO_PI) // Random phase for twinkling effect
    });
  }
}

function drawTwinklingStars() {
  noStroke();
  for (let star of stars) {
    let brightness = map(sin(frameCount * 0.02 + star.brightnessOffset), -1, 1, 100, 255); // Smooth twinkle
    fill(255, brightness); // White stars with varying brightness
    ellipse(star.x, star.y, 2, 2); // Draw star
  }
}

function updateMistParticles() {
  // Add new mist particles occasionally
  if (random() < 0.3) { // Adjust probability for particle generation
    let mistParticle = {
      x: random(-globeRadius * 0.5, globeRadius * 0.5), // Horizontal spread near center
      y: globeRadius * 0.4, // Starting near the bottom of the globe
      size: random(2, 10), // Varying sizes for mist effect
      alpha: 100, // Starting transparency
      speed: random(0.3, 1.2) // Slow upward motion
    };
    mistParticles.push(mistParticle);
  }

  // Update and display mist particles
  for (let i = mistParticles.length - 1; i >= 0; i--) {
    let p = mistParticles[i];
    p.y -= p.speed; // Move upward
    p.alpha -= 1; // Gradually fade out

    // Display mist particle
    noStroke();
    fill(200, 230, 255, p.alpha); // Soft light blue/white with fading transparency
    ellipse(p.x, p.y, p.size, p.size);

    // Remove mist particle if fully transparent
    if (p.alpha <= 0) {
      mistParticles.splice(i, 1);
    }
  }
}

function drawWavyStrip(xOffset, stripWidth, noiseStart, stripColor) {
  fill(stripColor);
  noStroke();

  beginShape();
  for (let y = -globeRadius; y < globeRadius; y += 10) { // Limit height to globe dimensions
    let noiseValue = noise(noiseStart + y * 0.01);
    let x = xOffset + map(noiseValue, 0, 1, -30, 30); // Wave motion
    vertex(x, y);
    vertex(x + stripWidth, y);
  }
  endShape(CLOSE);
}

function drawBuilding(offsetX, offsetY, scaleFactor) {
  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);
  noStroke();

  fill(180, 100, 60); // Brick color
  rect(50, 100, 300, 200); // Main building block
  rect(250, 80, 100, 20); // Roof Section (Top Right)

  fill(80);
  rect(290, 40, 10, 40); // Large Cross (Vertical)
  rect(280, 55, 30, 10); // Large Cross (Horizontal)

  fill(120, 60, 40);
  rect(170, 230, 60, 70); // Door Section

  noFill();
  stroke(80);
  strokeWeight(3);
  arc(200, 230, 80, 80, PI, TWO_PI); // Arch around Door

  fill(80, 120, 200);
  for (let x = 70; x < 350; x += 70) {
    rect(x, 120, 40, 60, 5); // Top Windows
    rect(x, 190, 40, 60, 5); // Bottom Windows
  }

  fill(100, 150, 100); // Ground (Grass)
  rect(0, 300, 400, 100);

  pop();
}

function drawMovieScreen() {
  fill(50);
  rect(-75, -50, 150, 100, 10); // Screen frame

  // Show video within the screen
  image(video, -70, -45, 140, 90);
}

function drawCarInGlobe(x, y, carScale) {
  push();
  translate(x,y); // Position the car slightly above the snowy base
  scale(carScale);

  // Apply bounce and rock effects
  translate(rockOffset, bounceOffset);

  // Car body
  fill(160, 32, 240);
  beginShape();
  vertex(-100, 0);
  bezierVertex(-100, -50, -80, -80, 0, -80);
  bezierVertex(80, -80, 100, -50, 100, 0);
  endShape(CLOSE);

  // Rear windshield
  fill(200, 230, 255, 200);
  beginShape();
  vertex(-70, -40);
  bezierVertex(-60, -70, 60, -70, 70, -40);
  endShape(CLOSE);

  // Taillights
  fill(255, 0, 0);
  rect(-85, -20, 25, 15, 5);
  rect(60, -20, 25, 15, 5);

  // Wheels with rotation
  drawWheel(-70, 30);
  drawWheel(70, 30);

  // Exhaust animation
  drawExhaust();

  pop();
}

function drawWheel(x, y) {
  push();
  translate(x, y);
  rotate(wheelRotation);
  fill(40);
  ellipse(0, 0, 40, 40);
  fill(100);
  ellipse(0, 0, 15, 15);
  pop();
}

function drawExhaust() {
  noStroke();
  for (let particle of exhaustParticles) {
    fill(100, 100, 100, particle.alpha);
    ellipse(particle.x, particle.y, particle.size);
  }
}

function updateCarAnimations() {
  // Bouncing suspension
  bounceOffset = sin(frameCount * 0.05) * 2;

  // Wheel rotation
  wheelRotation += 0.1;

  // Subtle rocking
  rockOffset = cos(frameCount * 0.02) * 1;

  // Exhaust animation
  if (frameCount % 10 === 0) {
    exhaustParticles.push({
      x: random(-10, 10),
      y: 30,
      alpha: 255,
      size: random(10, 20)
    });
  }

  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    exhaustParticles[i].y -= 1;
    exhaustParticles[i].alpha -= 5;
    if (exhaustParticles[i].alpha <= 0) {
      exhaustParticles.splice(i, 1);
    }
  }
}

function toggleVideo() {
  if (videoPlaying) {
    video.pause();
    videoPlaying = false;
  } else {
    video.play();
    videoPlaying = true;
  }
}

function drawScore() {
  fill(255); // White text color
  textAlign(CENTER, TOP);
  textSize(20);

  // Display Score
  text(`Score: ${score}`, width / 2, 10);

  // Display Combo
  text(`Combo: ${combo}`, width / 2, 40);

  // Display Max Combo
  text(`Max Combo: ${maxCombo}`, width / 2, 70);
}

function drawHitZoneLine() {
  if (currentScene === 4) {
    stroke(220, 20, 60, 200); // Dark pink color for the hit line
    strokeWeight(0);
    line(globeCenterX - globeRadius, hitZoneY, globeCenterX + globeRadius, hitZoneY);
    drawGlitterStars();
}



}

function checkForNoteHit() {
  let hit = false; // Track if a hit occurred

  for (let i = notes.length - 1; i >= 0; i--) {
    let note = notes[i];

    // Skip notes already marked as hit or missed
    if (note.hit || note.missed) {
      continue;
    }

    // Check if note is within hit zone
    if (abs(note.y - hitZoneY) < hitWindow) {
      note.hit = true; // Mark as hit
      score += 10; // Increase score
      combo++; // Increment combo streak
      if (combo > maxCombo) maxCombo = combo; // Track max combo streak

      feedbacks.push(new Feedback(note.x, hitZoneY, 'Hit')); // Add hit feedback
      hit = true; // Set hit flag
      break; // Stop checking other notes
    }
  
  }







  

}

function drawGUI() {
 noStroke(); // Ensure no border for GUI buttons
  for (let button of buttons) {
    fill(button.scene === currentScene ? "lightblue" : "gray");
    rect(button.x - 25, button.y - 25, 50, 50, 15);
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(button.label, button.x, button.y);
  }
}

function drawRadialGradient(x, y, radius) {
  let gradient = drawingContext.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(153, 153, 255, 0.7)');
  gradient.addColorStop(1, 'rgba(0, 0, 30, 0.3)');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(-radius, -radius, radius * 2, radius * 2);
}

function drawGlassShading() {
  noStroke();
  fill(255, 255, 255, 20);
  ellipse(0, 0, globeRadius * 2.1);
  fill(200, 220, 255, 30);
  ellipse(0, 0, globeRadius * 1.9);
}

function drawHighlights() {
  noStroke();
  fill(255, 255, 255, 150);
  ellipse(-globeRadius * 0.5, -globeRadius * 0.5, 30, 30);
  stroke(255, 255, 255, 50);
  noFill();
  strokeWeight(10);
  arc(0, 0, globeRadius * 1.7, globeRadius * 1.7, -PI / 4, -PI / 8);
}

function drawWoodenBase() {
  fill(120, 80, 40);
  rect(-100, 120, 200, 60, 10);
  fill(100, 60, 30);
  rect(-110, 150, 220, 30, 10);
}

function drawSnowflakes() {
  if (isSnowing) {
    for (let flake of snowflakes) {
      flake.update();
      flake.display();
    }
  }
}

function drawSnowyBase() {
  if (currentScene === 1) return; // Skip snowy base in Scene 1

  let baseColor;

  if (currentScene === 2) {
    baseColor = color(127, 255, 212, 180); // Aquamarine Blue
  } else if (currentScene === 3) {
    baseColor = color(0, 0, 0, 180); // Black
  } else if (currentScene === 4) {
    baseColor = color(255, 20, 147, 150); // Deep Pink
  } else {
    baseColor = color(255, 255, 255, 180); // Default (White with transparency)
  }
  fill(baseColor);
  noStroke();
  arc(0, globeRadius * 0.5, globeRadius * 1.5, globeRadius * 0.81, 0, PI, CHORD);
}
function startRhythmGame() {
  if (!gameStarted) {
    gameStarted = true;
    notes = [];
    score = 0;

    if (music && !music.isPlaying()) {
      music.play();
      music.setLoop(true);
      console.log("Music started");
    }
  }

  // Generate notes periodically
  if (frameCount % 60 === 0) { // Adjust for rhythm
    let angle = random(TWO_PI); // Random angle for placement
    let radius = random(globeRadius * 0.5); // Random radius within half the globe's size
    let x = globeCenterX + cos(angle) * radius; // X position inside the circle
    let y = -globeRadius; // Start above the top of the globe

    notes.push({
      x: x,
      y: y, // Start at the top of the globe
      hit: false
    });
  }
}
function drawNotes() {
  for (let i = notes.length - 1; i >= 0; i--) {
    let note = notes[i];

    // Skip already hit or missed notes
    if (note.hit || note.missed) {
      continue;
    }

    // Move the note downward
    note.y += noteSpeed;

    // Draw the note (heart shape)
    drawHeart(note.x, note.y, 15);

    // Check if the note has passed the hit zone and mark it as missed
    if (note.y > hitZoneY + 30) { 
      note.missed = true; // Mark note as missed
      combo = 0; // Reset combo
      feedbacks.push(new Feedback(note.x, hitZoneY, 'Miss')); // Add "Miss" feedback
    }
  }

}


function drawHeart(x, y, size) {
  push();
  translate(x, y);
  fill(255, 0, 0); // Red color
  noStroke();

  beginShape();
  vertex(0, -size / 2);
  bezierVertex(size / 2, -size, size, -size / 3, 0, size);
  bezierVertex(-size, -size / 3, -size / 2, -size, 0, -size / 2);
  endShape(CLOSE);

  pop();
}
function drawFeedbacks() {
  for (let i = feedbacks.length - 1; i >= 0; i--) {
    let fb = feedbacks[i];
    fb.update(); // Update feedback timer
    fb.display(); // Display feedback

    if (fb.isDone()) {
      feedbacks.splice(i, 1); // Remove expired feedback
    }
  }
}


function keyPressed() {
  if (key === "S" || key === "s") {
    startSnowfall();
  }

  if (currentScene === 4 && key === " ") { // Spacebar to hit notes
    checkForNoteHit();
  }
      }
    


function createGUI() {
  buttons = [
    { x: width / 2 - 120, y: height - 50, label: "🎄", scene: 1 },
    { x: width / 2 - 40, y: height - 50, label: "♨️", scene: 2 },
    { x: width / 2 + 40, y: height - 50, label: "🎬", scene: 3 },
    { x: width / 2 + 120, y: height - 50, label: "🎶", scene: 4 },
  ];
}

function drawGUI() {
  for (let button of buttons) {
    fill(button.scene === currentScene ? "lightblue" : "gray");
    rect(button.x - 25, button.y - 25, 50, 50, 15);
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(button.label, button.x, button.y);
  }
}
function mousePressed() {
  for (let button of buttons) {
    if (
      mouseX > button.x - 25 &&
      mouseX < button.x + 25 &&
      mouseY > button.y - 25 &&
      mouseY < button.y + 25
    ) {
      if (currentScene === 3 && button.scene !== 3 && videoPlaying) {
        video.stop(); // Stop the video when leaving Scene 3
        videoPlaying = false;
      }

      currentScene = button.scene;
    }
  }

  // Toggle video in Scene 3
  if (currentScene === 3) {
    toggleVideo();
  }

  if (currentScene !== 4 && music.isPlaying()) {
    
    music.stop();
    console.log("Music stopped");
  }





}

function mouseWheel(event) {
  zoom -= event.delta * 0.001;
  zoom = constrain(zoom, zoomMin, zoomMax);
}

function updateTilt() {
  tiltX = (mouseX - width / 2) * 0.001;
  tiltY = (mouseY - height / 2) * 0.001;
  tiltX = constrain(tiltX, -maxTilt, maxTilt);
  tiltY = constrain(tiltY, -maxTilt, maxTilt);
}

function resetSnowflakes(count = 200) {
  snowflakes = [];
  for (let i = 0; i < count; i++) {
    snowflakes.push(new Snowflake());
  }
}
class Snowflake {
  constructor() {
    this.resetPosition();
    this.size = random([2, 3.5, 5]); // Random size
    this.speed = random(1, 3); // Falling speed
    this.velocity = createVector(0, this.speed);
    this.acceleration = createVector(0, 0);
  }

  resetPosition() {
    let angle, r;
    do {
      angle = random(TWO_PI);
      r = random(globeRadius - 10);
      this.x = globeCenterX + cos(angle) * r;
      this.y = globeCenterY + sin(angle) * r;
    } while (this.y > globeCenterY + globeRadius * 0.5); // Ensure it starts inside the globe
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    let gravity = createVector(tiltX, tiltY).mult(0.1); // Apply tilt for realism
    this.applyForce(gravity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(3); // Limit falling speed
    this.x += this.velocity.x / zoom;
    this.y += this.velocity.y / zoom;
    this.acceleration.mult(0); // Reset acceleration

    // Reset snowflake if it falls outside the globe
    let d = dist(this.x, this.y, globeCenterX, globeCenterY);
    if (d > globeRadius || this.y > globeCenterY + globeRadius * 0.8) {
      this.resetPosition();
    }
  }

  display() {
    push();
    fill(255); // White snowflakes
    noStroke();
    ellipse(this.x, this.y, this.size, this.size); // Draw snowflake as small circle
    pop();
  }
}


class Feedback {
  constructor(x, y, type) {
    this.x = x; // X-coordinate
    this.y = y; // Y-coordinate
    this.type = type; // Type: 'Hit' or 'Miss'
    this.timer = 60; // Duration in frames
  }

  update() {
    this.timer--; // Decrease timer each frame
  }

  display() {
    push();
    translate(this.x, this.y);
    textAlign(CENTER, CENTER);
    textSize(20);

    if (this.type === 'Hit') {
      fill(0, 255, 0, map(this.timer, 0, 60, 0, 255)); // Green fading text
      text('Hit!', 0, 0);
    } else if (this.type === 'Miss') {
      fill(255, 0, 0, map(this.timer, 0, 60, 0, 255)); // Red fading text
      text('Miss!', 0, 0);
    }
    pop();
  }

  isDone() {
    return this.timer <= 0; // Expired feedback
  }

}
