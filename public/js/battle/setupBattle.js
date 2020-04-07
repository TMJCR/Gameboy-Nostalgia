class SetupBattle {
  constructor() {
    this.clickHandlers = true;
    this.dialogueisActive = false;
    this.moveInAction = false;
    this.pokemonListSetupCompleted = false;
    this.finalBattle = false;
  }

  assignPlayerPokemon() {
    const firstRandomPokemon = randomPokemonFromCollection([
      59,
      65,
      68,
      71,
      76,
      85,
      103,
      125,
      106,
      107,
      26,
    ]);
    const secondRandomPokemon = randomPokemonFromCollection([
      112,
      115,
      3,
      6,
      9,
      134,
      135,
      136,
      144,
      145,
      146,
      149,
    ]);
    const pokemonNumberArray = [
      1,
      4,
      7,
      firstRandomPokemon,
      secondRandomPokemon,
    ];
    return pokemonNumberArray;
  }
  assignComputerPokemon() {
    const firstEnemy = randomPokemonFromCollection([
      10,
      11,
      12,
      13,
      14,
      16,
      19,
      21,
    ]);
    const secondEnemy = randomPokemonFromRange(22, 149);
    const thirdEnemy = randomPokemonFromCollection([
      3,
      6,
      9,
      123,
      134,
      135,
      136,
      144,
      145,
      146,
      149,
    ]);
    const gyarados = 130;
    if (secondEnemy === thirdEnemy || secondEnemy === gyarados) {
      secondEnemy -= 1;
    }
    const computerNumberArray = [firstEnemy, secondEnemy, thirdEnemy, gyarados];
    return computerNumberArray;
  }
  async setUpBattle() {
    this.currentEnemy = 0;
    const playerTeam = this.assignPlayerPokemon();
    const computerTeam = this.assignComputerPokemon();
    this.player = new Player(playerTeam, 'player');
    this.computer = new Computer(computerTeam, 'computer');
    await this.player.createTeam();
    await this.computer.createTeam();
    this.player.pokemonStillAlive = this.player.team.members.length;
  }

  async initiateBattle() {
    this.inBattle = true;
    const currentEnemy = this.computer.team.members[this.currentEnemy];
    this.battle = new Battle(this.player, this.computer);
    this.battle.setUpPokemonList();
    const textToDisplay = `A wild ${toSentenceCase(
      currentEnemy.name
    )} appeared...`;
    UpdateDialogueBox(textToDisplay, 'dialogueBox');
  }

  gameOver() {
    document.querySelector('.battleContainer').style.display = 'none';
    const gameDiv = document.querySelector('#canvasDiv');
    gameDiv.hidden = false;
    const light = document.querySelector('.light');
    const turnedOffScreen = ctx.createPattern(turnedOff, 'repeat');
    ctx.fillStyle = turnedOffScreen;
    ctx.fill();
    light.style.background = '#600';
  }
  connectionIssues() {
    this.gameOver();
  }
}
