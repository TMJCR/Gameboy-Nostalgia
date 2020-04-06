class Pokemon {
  constructor(pokemon, team) {
    this.name = pokemon.data.name;
    this.moves = pokemon.moves;
    this.preDefinedMoves = this.preDefineMoves();
    this.frontSprite = pokemon.data.sprites.front_default;
    this.backSprite = pokemon.data.sprites.back_default;
    this.types = pokemon.types;
    this.stats = pokemon.stats;
    this.startHealth = pokemon.stats.hp;
    this.currentHealth = pokemon.stats.hp;
    this.alive = true;
    this.team = team;
  }
  preDefineMoves() {
    let moves = [];
    if (this.name === 'bulbasaur') {
      moves = [0, 4, 15, 5];
    } else if (this.name === 'charmander') {
      moves = [14, 15, 31, 36];
    } else if (this.name === 'squirtle') {
      moves = [11, 12, 16, 33];
    } else {
      if (this.moves.length < 15) {
        moves = [0, 1, 2, 3];
      } else {
        moves = [
          this.pickRandomMove(0, 4),
          this.pickRandomMove(5, 9),
          this.pickRandomMove(10, 14),
          this.pickRandomMove(15, this.moves.length),
        ];
      }
    }
    return moves;
  }
  takeDamage(damage) {
    if (damage <= 0) {
      game.battle.specialDamageMessage = 'had no effect on';
    }

    if (this.currentHealth - damage <= 0) {
      this.currentHealth = 0;
      this.alive = false;
    } else {
      this.currentHealth -= damage;
    }
  }
  async attack(moveNum, opponent) {
    if (!opponent.alive || !this.alive) {
      return;
    }
    const move = this.moves[moveNum].url;
    const moveData = await getMoveData(move);
    const damage = game.battle.calculateDamage(moveData, this, opponent);
    const moveName = toSentenceCase(this.moves[moveNum].name);
    const textToDisplay = `${toSentenceCase(this.name)} used ${moveName}...`;
    await UpdateDialogueBox(textToDisplay, 'dialogueBox');
    opponent.takeDamage(damage);
    opponent.showDamage(damage, game.battle.damageAnimation);
    const opponentHealth =
      (opponent.currentHealth / opponent.startHealth) * 100;
    this.updateMiniHealthBar(opponent, opponentHealth);
    await this.updateHealthBar(opponentHealth, `${opponent.team}-health-bar`);

    if (opponentHealth <= 0) {
      opponent.alive = false;
      await opponent.faint();
      return;
    }
    if (game.battle.specialDamageMessage) {
      const textToDisplay = `${moveName} ${
        game.battle.specialDamageMessage
      } ${toSentenceCase(opponent.name)}...`;
      await UpdateDialogueBox(textToDisplay, 'dialogueBox');
    }
  }
  showDamage(damage, degreeOfDamage) {
    if (damage <= 0) {
      return;
    }
    const image = document.querySelector(`#${this.team}PokemonImage`);
    image.style.animation = 'shake 0.5s';
    image.style.animationIterationCount = '3';
    this.removeDamageAnimation(degreeOfDamage);
  }
  removeDamageAnimation(delay) {
    setTimeout(() => {
      const image = document.querySelector(`#${this.team}PokemonImage`);
      image.style.animation = 'none';
    }, delay);
  }
  faint() {
    const image = document.querySelector(`#${this.team}PokemonImage`);
    const textToDisplay = `${toSentenceCase(this.name)} fainted...`;
    const team = this.team;
    return new Promise((resolve, reject) => {
      setTimeout(async function () {
        image.style.width = '250px';
        image.style.opacity = 0;
        await UpdateDialogueBox(textToDisplay, 'dialogueBox');
        resolve();
        if (team === 'player') {
          game.player.pokemonStillAlive -= 1;
          if (game.player.pokemonStillAlive === 0) {
            await UpdateDialogueBox(
              `You have run out of pokemon...hopefully Pikachu will be okay fighting alone!`,
              'dialogueBox'
            );
            const gameDiv = document.querySelector('.wrapper');
            gameDiv.style.display = 'none';
            await game.gameOver();
          } else {
            game.battle.showPokemonSelection();
          }
        }
      }, 1000);
    });
  }
  updateHealthBar(resultingHealthPercentage, id) {
    return new Promise((resolve, reject) => {
      const healthBar = document.querySelector(`#${id}`);
      const animateHealthBar = setInterval(() => {
        const computedStyle = getComputedStyle(healthBar);
        const health =
          parseFloat(computedStyle.getPropertyValue('--health')) || 0;
        if (health <= resultingHealthPercentage) {
          clearInterval(animateHealthBar);
          resolve();
        }
        healthBar.style.setProperty('--health', health - 0.1);
        this.updateHealthBarColour(health, healthBar);
      }, 1);
    });
  }
  resetHealthBar(resultingHealthPercentage, id) {
    const healthBar = document.querySelector(`#${id}`);
    healthBar.style.opacity = 1;
    const computedStyle = getComputedStyle(healthBar);
    const health = resultingHealthPercentage;
    healthBar.style.setProperty('--health', health);
    this.updateHealthBarColour(health, healthBar);
  }
  updateHealthBarColour(healthAmount, healthBar) {
    const root = document.querySelector(':root');
    const pseudoClass = `--${healthBar.id}`;
    if (healthAmount < 20) {
      root.style.setProperty(`${pseudoClass}`, 'var(--low-health)');
    } else if (healthAmount < 50) {
      root.style.setProperty(`${pseudoClass}`, 'var(--mid-health)');
    } else {
      root.style.setProperty(`${pseudoClass}`, 'var(--normal-health)');
    }
  }
  updateMiniHealthBar(opponent, newHealthPercentage) {
    if (opponent.team === 'computer') {
      return;
    }
    const findMiniHealthBar = (pokemon) => pokemon.name === opponent.name;
    const healthBarIndex = game.player.team.members.findIndex(
      findMiniHealthBar
    );
    const miniHealthBar = document.querySelector(
      `#pokemon${healthBarIndex}-health-bar`
    );
    miniHealthBar.style.setProperty('--health', newHealthPercentage);
    this.updateHealthBarColour(newHealthPercentage, miniHealthBar);
  }
  pickRandomMove(min, max) {
    const randomMove = Math.floor(Math.random() * (max - min)) + min;
    return randomMove;
  }
}
