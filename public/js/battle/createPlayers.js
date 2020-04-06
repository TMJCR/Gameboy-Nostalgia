class CreatePlayer {
  constructor(pokemonNumbers, teamName) {
    this.teamName = teamName;
    this.team = {
      members: [],
      pokemonNumbers: pokemonNumbers,
    };
  }
  async createTeam() {
    for (const teamMember of this.team.pokemonNumbers) {
      await getPokemonData(teamMember).then((data) => {
        this.team.members.push(new Pokemon(data, this.teamName));
      });
    }
  }
}

class Computer extends CreatePlayer {}

class Player extends CreatePlayer {
  animatePokeBall() {
    const image = document.querySelector('#playerPokemonImage');
    image.style.transition = 'all 0.6s';
    image.style.margin = '0';
    image.style.opacity = 1;
    setTimeout(() => {
      image.style.border = '0px solid white';
      image.style.transform = 'rotate(0deg)';
      image.style.width = '340px';
    }, 500);
  }
  async choosePokemon(num) {
    game.moveInAction = true;
    const currentEnemy = game.computer.team.members[game.currentEnemy];
    this.currentPokemon = this.team.members[num];
    const currentPlayerPokemonHealth =
      (this.currentPokemon.currentHealth / this.currentPokemon.startHealth) *
      100;
    if (this.currentPokemon.stats.speed >= currentEnemy.stats.speed) {
      this.playerMovesFirst = true;
    } else {
      this.playerMovesFirst = false;
    }
    await this.animatePokeBall();
    this.currentPokemon.resetHealthBar(
      currentPlayerPokemonHealth,
      'player-health-bar'
    );
    await game.battle.updateImageAndName(this.currentPokemon);
    assignMovesToButtons(this.currentPokemon, currentEnemy);

    const textToDisplay = `Go ${toSentenceCase(this.currentPokemon.name)} ...`;
    await UpdateDialogueBox(textToDisplay, 'dialogueBox');
  }
  async prepareForNextBattle() {
    const gameDiv = document.querySelector('#canvasDiv');
    gameDiv.hidden = false;
    if (game.finalBattle) {
      await game.gameOver();
      return;
    }
    game.currentEnemy += 1;
    if (game.currentEnemy === game.computer.team.members.length - 1) {
      game.finalBattle = true;
    }
    ctx.fillStyle = terrainPattern;
    ctx.fill();
    openWorld.draw();
    pikachuAnimation = setInterval(function () {
      animatePickachu();
    }, 250);

    const image = document.querySelector('#playerPokemonImage');
    image.src = '';
    const pokemonName = document.querySelector(`#playerPokemonName`);
    const pokemonHealthBar = document.querySelector(`#player-health-bar`);
    pokemonHealthBar.style.opacity = 0;
    pokemonName.innerHTML = '';
    game.initiateBattle();
    const computer = game.computer.team.members[game.currentEnemy];
    game.battle.updateImageAndName(computer);
    keyNavigationDisabled = false;
    game.moveInAction = false;
    game.battle.hidePokemonSelection();
    game.battle.preparePlayerPokemonImage();
  }

  async selectAttack(pokemon, opponent, move) {
    const randomOpponentMove = opponent.pickRandomMove(
      0,
      opponent.moves.length
    );
    if (this.playerMovesFirst) {
      await pokemon.attack(move, opponent);
      await opponent.attack(randomOpponentMove, pokemon);
    } else {
      await opponent.attack(randomOpponentMove, pokemon);
      await pokemon.attack(move, opponent);
    }
    if (opponent.currentHealth <= 0) {
      if (game.finalBattle) {
        await game.battle.finalBattleDialogue(opponent);
      } else {
        await game.battle.nextBattleDialogue(opponent);
      }
      document.querySelector('.wrapper').style.display = 'none';
      this.prepareForNextBattle();
      return;
    }
    await game.battle.enableMoveSelection();

    game.moveInAction = false;
  }
}
