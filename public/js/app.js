const openWorld = new OpenWorld();
let gridDimensions = openWorld.getGridDimensionsForBattleAnimation(
  0,
  0,
  canvasHeight,
  canvasWidth,
  []
);
const light = document.querySelector('.light');
light.style.background = '#f00';

//Load the initial sprite
window.addEventListener('load', async () => {
  document.querySelector('.introText').style.opacity = 1;
  terrainPattern = ctx.createPattern(terrain, 'repeat');
  ctx.fillStyle = terrainPattern;
  ctx.rect(0, 0, canvasWidth, canvasHeight);
  ctx.fill();
  openWorld.draw();
  pikachuAnimation = setInterval(function () {
    animatePickachu();
  }, 250);
  const instructions =
    'With your team of Pokemon, go and help Pikachu defeat the mighty Gyarados...';
  await UpdateDialogueBox(instructions, 'introText');
  keyNavigationDisabled = false;
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  if (keyNavigationDisabled) return;
  document.querySelector('.introText').style.opacity = 0;
  if (e.keyCode === 39) {
    openWorld.moveCharacter(xPosition, yPosition, 'right');
  } else if (e.keyCode === 37) {
    openWorld.moveCharacter(xPosition, yPosition, 'left');
  } else if (e.keyCode === 38) {
    openWorld.moveCharacter(xPosition, yPosition, 'up');
  } else if (e.keyCode === 40) {
    openWorld.moveCharacter(xPosition, yPosition, 'down');
  }
});

const game = new SetupBattle();
setUp();

async function setUp() {
  await game.setUpBattle();
  game.initiateBattle();
}

const battleDiv = document.querySelector('.wrapper');
const selectPokemon = document.querySelector('.eight');
battleDiv.style.display = 'none';
selectPokemon.style.opacity = '0';
