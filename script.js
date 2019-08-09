const startImage = new Image();
startImage.src = "./images/baby-start.png";

const momImg = new Image();
momImg.src = "./images/momavatar.png";

const fryingPanImg = new Image();
fryingPanImg.src = "./images/frying-pan.png";

const bigPanImg = new Image();
bigPanImg.src = "./images/big-pan.png";

const panImages = [fryingPanImg, bigPanImg]

const coffeeImg = new Image();
coffeeImg.src = "./images/coffee.jpeg";

const crying1Img = new Image();
crying1Img.src = "./images/crying1.jpeg";

const crying2Img = new Image();
crying2Img.src = "./images/crying2.jpeg";

const crying3Img = new Image();
crying3Img.src = "./images/crying4.jpeg";

const crying4Img = new Image();
crying4Img.src = "./images/crying5.jpeg";

const crying5Img = new Image();
crying5Img.src = "./images/crying6.jpeg";

const cryingBabiesImages = [crying1Img, crying2Img, crying3Img, crying4Img, crying5Img];

let randomBabyImage = cryingBabiesImages[Math.floor(Math.random() * cryingBabiesImages.length)]

const sleepingBabyImage = new Image();
sleepingBabyImage.src = "./images/sleeping-baby.jpeg";

const pacifierImg = new Image();
pacifierImg.src = "./images/pacifier.jpeg";

let displayObjectArray = [];
let lives = 3;
let audiosArray;
let score = 0;
let displayScore;
let displayLevel;
let gameDone = true;
let level = 0;
let parentSpeedLeft = 20;
let parentSpeedRight = 20;
let canvas;
let ctx;
let mom;
let pan;
let frameCounter = 0;

// move logic to classes, create only one object array "display objects" and this object should have a speed 

class Parent {
  constructor(image, width, height, x, y) {
    this.width = width,
      this.height = height,
      this.x = x,
      this.y = y,
      this.image = image
  }

  moveRight() {
    if (this.x < 470) {
      this.x += parentSpeedRight;
    }
  }

  moveLeft() {
    if (this.x > -10) {
      this.x -= parentSpeedLeft;
    }
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class DisplayObject {
  constructor() {
    this.x = Math.floor(Math.random() * (canvas.width - 60));
    this.y = 0;
    this.height = 40;
    this.width = 60;
    this.speed = 10;
  }
}

class Pan extends DisplayObject {
  constructor(image) {
    super();
    this.image = image;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collect() {
    score += 10;
    femaleRelief.play();
  }

  drop() {
    lives--;
    pan1.play();
  }

}

class Coffee extends DisplayObject {
  constructor() {
    super();
    this.x = Math.floor(Math.random() * canvas.width - 50);
    this.y = 0;
    this.height = 40;
    this.width = 60;
    this.image = coffeeImg;
    this.speed = 20;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collect() {
    drinkingCoffee.play();
    parentSpeedLeft += 3;
    parentSpeedRight += 3;
  }

  drop() {

  }
}

class Pacifier extends DisplayObject {
  constructor() {
    super();
    this.image = pacifierImg;
    this.speed = 20;
    this.height = 18;
    this.width = 14;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  collect() {
    lives++;
  }

  drop() {
  }
}

function startScreen() {
  ctx.drawImage(startImage, 0, 0, 530, 530);
  ctx.font = "bold 25px baby";
  ctx.fillText(
    "Instructions",
    220,
    80),
    ctx.font = "bold 20px baby";
  ctx.fillText(
    "- Try to catch anything that can wake the baby by falling",
    50,
    145
  ),
    ctx.font = "bold 20px baby";
  ctx.fillText(" using the left and right arrows ⬅️➡️.",
    55,
    190);
  ctx.font = "bold 20px baby";
  ctx.fillText("- The pacifier can be a real life saver 🍀.",
    51,
    265);
  (ctx.font = "bold 20px baby");
  ctx.fillText("- Don't forget to drink your coffee ☕️ !", 51, 330);
  (ctx.font = "bold 20px baby");
  ctx.fillText(` Press the "Start"  button when you're ready 😁`, 51, 410);
  (ctx.font = "bold 20px baby");
  ctx.fillText(`👶👶👶`, 220, 470);

}

function drawWakeUpScreen() {
  ctx.drawImage(randomBabyImage, 0, 0, 530, 530);
  displayScore.innerText = "Game Over";
  displayLevel.innerText = "ten and counting..."
}

function drawWinScreen() {
  ctx.drawImage(sleepingBabyImage, 0, 0, 530, 530);
  displayScore.innerText = "Win!";
}

function initialize() {
  gameDone = false;
  displayScore.innerText = "0";
  displayLevel.innerText = "0";
  lives = 3;
  score = 0;
  level = 0;
  displayObjectArray = [];
  crying.pause();
  snoring.pause();
}

function drawLives() {
  space = 0;
  for (let i = 0; i < lives; i++) {
    ctx.drawImage(pacifierImg, 10 + space, 10, 20, 20);
    space += 34;
  }
}

function playGame() {
  ctx.clearRect(0, 0, 800, 850);
  drawLives();
  mom.draw();
  displayObjectArray.forEach((object) => {
    object.draw()
  })

  if (frameCounter % 10 === 0) {
    displayObjectArray.forEach((object) => {
      object.y += object.speed;
    })
  }
  // every three seconds
  if (frameCounter % 180 === 0 && !gameDone) {
    displayObjectArray.push(new Pan(panImages[Math.floor(Math.random() * panImages.length)]));
  }

  if (frameCounter % (60 * 100) === 0) { // how can I control this other than that?
    displayObjectArray.push(new Pacifier());
  }
  catchPan();
  frameCounter++;
}

function draw() {
  if (lives > 0 && !gameDone) {
    playGame();
    if (score >= 150) {
      win();
    }
  } else if (lives < 1) {
    if (!gameDone) {
      crying.play()
      setTimeout(() => {
        crying.pause();
        crying.currentTime = 0;
      }, 10000);
    }
    gameOver();
  } else if (score >= 150) {
    win();
  }
}

function intersectParent(parent, object) {
  let parentleft = parent.x;
  let parenttop = parent.y;
  let parentright = parent.x + parent.width;
  let parentbottom = parent.y + parent.height;

  let objectleft = object.x + 30;
  let objecttop = object.y;
  let objectright = object.x + object.width - 20;
  let objectbottom = object.y + object.height;
  return !(
    parentleft > objectright ||
    parentright < objectleft ||
    parenttop > objectbottom ||
    parentbottom < objecttop
  );
}

function intersectGround(object) {
  let groundbottom = 530;
  let objectbottom = object.y + object.height;
  return (
    groundbottom < objectbottom
  );
}

function catchPan() {
  for (var i = 0; i < displayObjectArray.length; i++) {
    let object = displayObjectArray[i];

    if (intersectGround(object)) {
      object.intersects = true;
      object.drop();
    } else if (intersectParent(mom, object)) {
      object.intersects = true;
      object.collect();
      displayScore.innerText = score;
      if (score > 50 && score % 50 === 0) {
        level += 1;
        object.speed += level;// maybe hardcode a value 
        displayLevel.innerText = level;
        displayObjectArray.push(new Coffee());
      }
      // if (level % 2 === 0) {
      //   parentSpeedLeft -= 2;
      //   parentSpeedRight -= 2;
      //}
      if (score >= 70 && score % 70 === 0) {
        displayObjectArray.push(new Pacifier());
      }
    }
  }
  displayObjectArray = displayObjectArray.filter(obj => !obj.intersects);
}

function gameOver() {
  gameDone = true;
  drawWakeUpScreen();
}

function win() {
  gameDone = true;
  clearInterval(draw, 10);
  pan1.pause();
  snoring.play();
  drawWinScreen();
}

window.onload = function () {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  mom = new Parent(momImg, 67, 100, 265, 435)
  displayScore = document.getElementById("score");
  displayLevel = document.getElementById("level");
  audiosArray = [pan1, femaleRelief, crying, snoring, drinkingCoffee];

  startScreen();
  setInterval(draw, 10);

  document.getElementById("start-button").onclick = function () {
    if (gameDone) {
      initialize();
      gameDone = false;
    }
  }

  document.getElementById("mute-button").onclick = function () {
    audiosArray.forEach((audio) => {
      if (audio.muted) {
        audio.muted = false;
      } else {
        audio.muted = true;
      }
    })
  }
}

window.onkeydown = (event) => {
  if (event.keyCode === 39) {
    mom.moveRight();
  } else if (event.keyCode === 37) {
    mom.moveLeft();
  }

}




/* QUESTIONS

HOW TO STOP THE SOUNDS

appreciate `a code review, clean code and well organized
*/


