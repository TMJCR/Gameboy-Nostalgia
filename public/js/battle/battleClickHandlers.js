function assignMovesToButtons(pokemon, opponent) {
  const moves = pokemon.preDefinedMoves;
  const moveMenu = document.querySelector(`#moveMenu`);
  moveMenu.innerHTML = '';
  moves.forEach((move, index) => {
    const moveText = document.createElement('p');
    moveMenu.appendChild(moveText);
    moveText.classList.add('menuItem', 'move');
    moveText.id = `move${index}`;
    moveText.innerHTML = pokemon.moves[move].name.toUpperCase();
    moveText.addEventListener('click', () => {
      if (game.dialogueisActive == false || game.moveInAction == false) {
        game.battle.disableMoveSelection();
        game.player.selectAttack(pokemon, opponent, move);
      }
    });
  });
}

document.querySelector('#pkmn').addEventListener('click', () => {
  if (game.dialogueisActive || game.moveInAction || game.pokemonMenuVisible) {
    return;
  }
  game.battle.disableMoveSelection();
  game.battle.showPokemonSelection();
  game.battle.inActiveBattle = true;
});

document.querySelector('#fight').addEventListener('click', async () => {
  if (!game.dialogueisActive && !game.battle.inActiveBattle) {
    game.battle.hidePokemonSelection();
    await game.battle.preparePlayerPokemonImage();
    game.player.choosePokemon(0);
    game.battle.inActiveBattle = true;
  }
});

document.querySelector('#run').addEventListener('click', async () => {
  if (!game.dialogueisActive && !game.battle.inActiveBattle) {
    game.battle.hidePokemonSelection();
    const textToDisplay = `You can't run from this battle...you need to save Pickachu...`;
    await UpdateDialogueBox(textToDisplay, 'dialogueBox');
    game.player.choosePokemon(0);
    game.battle.inActiveBattle = true;
  }
});
