let keyNavigationDisabled = true;
const canvasWidth = 750;
const canvasHeight = 500;

const canvas = document.querySelector("#canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext("2d");
const terrain = new Image();
terrain.src = "./public/img/terrain.png";
const turnedOff = new Image();
turnedOff.src = "./public/img/turnedOff.png";

const turnedOffColor = "#ae9132";
ctx.fillStyle = turnedOffColor;
ctx.rect(0, 0, canvasWidth, canvasHeight);
ctx.fill();

const boundaryZones = {
  outOfBounds: [
    {
      xmin: 55,
      xmax: 620,
      ymin: 0,
      ymax: 30,
    },
    {
      xmin: 250,
      xmax: 480,
      ymin: 30,
      ymax: 190,
    },
    {
      xmin: 480,
      xmax: 620,
      ymin: 125,
      ymax: 190,
    },
    {
      xmin: 0,
      xmax: 750,
      ymin: 390,
      ymax: 500,
    },
  ],
  battleZones: [
    {
      xmin: 0,
      xmax: 750,
      ymin: 195,
      ymax: 350,
    },
  ],
};

let xPosition = 0;
let yPosition = 0;

const spriteRowRight = 0;
const spriteRowLeft = 1;
const spriteRowUp = 3;
const spriteRowDown = 2;

let spriteXPosition = 0;
let spriteYPosition = 0;

const spriteSheetWidth = 260;
const spriteSheetHeight = 635;

const cols = 4;
const rows = 8;

const spriteWidth = spriteSheetWidth / cols;
const spriteHeight = spriteSheetHeight / rows;

const character = new Image();
character.src = "./public/img/Ash.png";

speed = 10;
let currentFrame = 0;
let numberOfBattles = 0;
let battleInteractionCoefficient = 0.06;
let pikachuAnimation;
