function toSentenceCase(text) {
  return text.split('')[0].toUpperCase() + text.slice(1);
}

async function UpdateDialogueBox(text, dialogueDiv) {
  const dialogueBox = document.querySelector(`.${dialogueDiv}`);
  dialogueBox.innerHTML = '';
  await typeDialogue(text, dialogueBox);
}

function typeDialogue(text, dialogueBox) {
  bufferTextDelay = '                   ';
  const textPlusDelay = text + bufferTextDelay;
  game.dialogueisActive = true;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < textPlusDelay.length; i++) {
      setTimeout(function timer() {
        dialogueBox.innerHTML += textPlusDelay[i];
        if (textPlusDelay.length - 1 === i) {
          game.dialogueisActive = false;
          resolve();
        }
      }, i * 50);
    }
  });
}

function randomPokemonFromRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomPokemonFromCollection(array) {
  const numberToChooseFrom = array.length;
  const selection = Math.floor(Math.random() * numberToChooseFrom);
  return array[selection];
}
