const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOver = document.querySelector('.game-over');
const score = document.querySelector('.score');
const highScore = document.querySelector('#high-score');
const turtle = document.querySelector('.turtle');
const bullet = document.querySelector('.bullet');
const clouds = document.querySelector('.clouds');
const gameBoard = document.getElementById('game-board');

const musicGame = new Audio('sounds/game.mp3');
musicGame.loop = true;
musicGame.volume = 0.5;

const soundBtn = document.getElementById('sound-btn');
let isMuted = false;

soundBtn.addEventListener('click', () => {
  if (isMuted) {
    musicGame.muted = false;
    soundBtn.textContent = '🔊';
  } else {
    musicGame.muted = true;
    soundBtn.textContent = '🔇';
  }
  isMuted = !isMuted;
});

document.addEventListener('click', () => {
  musicGame.play();
}, { once: true });

document.addEventListener('keydown', () => {
  musicGame.play();
}, { once: true });

const setCookie = function (name, value, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";SameSite=Lax;path=/";
};

const getCookie = function (name) {
  let cookies = decodeURIComponent(document.cookie).split(';');
  name = name + "=";
  for (let c of cookies) {
    c = c.trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
};

let scoreValue = 0;
let highScoreValue = getCookie('high-score') || 0;
let beginnerLevel = 5;
let proLevel = 10;
highScore.textContent = highScoreValue;

const jump = () => {
  if (gameOver.style.display === 'block' || mario.classList.contains('jump')) {
    return;
  }

const musicJump = new Audio('sounds/jump.wav');
  musicJump.play();
  mario.classList.add('jump');
 
  scoreValue += 1;
  score.textContent = scoreValue;

  levelPass();

  if (scoreValue >= proLevel) {
    mario.src = './images/mario-flying.gif';
    mario.style.width = '100px';
  }

  if (scoreValue > highScoreValue) {
    highScoreValue = scoreValue;
    highScore.textContent = highScoreValue;
    setCookie('high-score', highScoreValue, 365);
  }

  setTimeout(() => {
    mario.classList.remove('jump');
    if (scoreValue >= proLevel) {
      mario.src = './images/mario-pro.gif';
      mario.style.width = '120px';
    }
  }, 800);
};

const waitingFailure = () => {
  const raw = mario.getBoundingClientRect();
  const marioRect = {
    left: raw.left + raw.width * 0.15,
    right: raw.right - raw.width * 0.15,
    top: raw.top + raw.height * 0.10,
    bottom: raw.bottom
  };

const pipeRect = pipe.getBoundingClientRect();
const turtleRect = turtle.getBoundingClientRect();
const bulletRect = bullet.getBoundingClientRect();

const hit = (a, b) =>
  a.left < b.right &&
  a.right > b.left &&
  a.bottom > b.top &&
  a.top < b.bottom;

  if (hit(marioRect, pipeRect) || hit(marioRect, turtleRect) || hit(marioRect, bulletRect)) {
    const dieSound = new Audio('sounds/mariodie.wav');
    dieSound.volume = 0.5;
    dieSound.play();
    musicGame.pause();

mario.style.animationPlayState = 'paused';
pipe.style.animationPlayState = 'paused';
turtle.style.animationPlayState = 'paused';
bullet.style.animationPlayState = 'paused';
clouds.style.animationPlayState = 'paused';


  
mario.src = './images/game-over.png';
mario.style.width = '75px';
mario.style.marginLeft = '50px';

gameOver.style.display = 'block';
gameBoard.classList.add('game-board-over');

    clearInterval(loop);
    
    document.removeEventListener('keydown', jump);
    document.removeEventListener('touchstart', jump);
  }
};

const levelPass = () => {
  switch (scoreValue) {
    case beginnerLevel:
      mario.src = './images/mario-beginner.gif';
      mario.style.width = '110px';
      const powerSound1 = new Audio('sounds/powerup.wav');
      powerSound1.play();
      break;
    case proLevel:
      mario.src = './images/mario-pro.gif';
      mario.style.width = '120px';
      const powerSound2 = new Audio('sounds/powerup.wav');
      powerSound2.play();
      break;
  }
};

let loop = setInterval(waitingFailure, 10);

const restartGame = function () {
  gameOver.style.display = 'none';
  gameBoard.classList.remove('game-board-over');

  mario.style.animation = 'none';
  mario.offsetHeight;
  mario.style.animation = null;

  mario.src = './images/mario-starter.gif';
  mario.style.width = '75px';
  mario.style.marginLeft = '0';
  mario.style.bottom = '0';

  clouds.style.left = 'auto';
  clouds.style.animation = 'clouds-animation 20s infinite linear';

  pipe.style.left = 'auto';
  pipe.style.animation = 'pipe-animation 4s infinite linear';

  turtle.style.left = 'auto';
  turtle.style.animation = 'turtle-animation 36s infinite linear';

  bullet.style.left = 'auto';
  bullet.style.animation = 'bullet-animation 128s infinite linear';

  scoreValue = 0;
  score.textContent = scoreValue;

  musicGame.currentTime = 0;
  musicGame.play();

  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', jump);

  loop = setInterval(waitingFailure, 10);
};


document.querySelector('.retry').addEventListener('click', restartGame);

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);
