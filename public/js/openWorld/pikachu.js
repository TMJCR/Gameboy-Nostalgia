let pikachuXLocation = 420;
let pikachuYLocation = 115;

let pickachuSheetWidth = 720;
let pickachuSheetHeight = 74;

let pickachuSpriteSheetXValue = 0;
let pickachuSpriteSheetYValue = 0;

const pickachuCols = 10;
const pickachuRows = 1;

let pickachuSpriteWidth = pickachuSheetWidth / pickachuCols;
let pickachuSpriteHeight = pickachuSheetHeight / pickachuRows;

let currentPickachuSpriteFrame = 0;
let pikachu = new Image();
pikachu.src = '/img/Pikachu_sprite.png';

function updatePickachuAnimation() {
  currentPickachuSpriteFrame = ++currentPickachuSpriteFrame % pickachuCols;
  pickachuSpriteSheetXValue = currentPickachuSpriteFrame * pickachuSpriteWidth;
}

function animatePickachu() {
  updatePickachuAnimation();
  ctx.drawImage(
    pikachu,
    pickachuSpriteSheetXValue,
    pickachuSpriteSheetYValue,
    pickachuSpriteWidth,
    pickachuSpriteHeight,
    pikachuXLocation,
    pikachuYLocation,
    pickachuSpriteWidth,
    pickachuSpriteHeight
  );
}

function stopAnimating() {
  clearInterval(pikachuAnimation);
}
