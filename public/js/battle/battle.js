class Battle {
  constructor(player, computer) {
    this.inActiveBattle = false;
    this.playerTeam = player.team.members;
    this.computer = computer.team.members[game.currentEnemy];
    this.updateImageAndName(this.computer);
  }
  setUpPokemonList() {
    if (game.pokemonListSetupCompleted) {
      return;
    }
    document.querySelectorAll('.teamMemberName').forEach((teamMember, idx) => {
      teamMember.innerHTML = game.player.team.members[idx].name.toUpperCase();
    });
    document.querySelectorAll('.teamMemberImage').forEach((teamMember, idx) => {
      teamMember.src = `https://img.pokemondb.net/artwork/${game.player.team.members[idx].name}.jpg`;
    });
    document.querySelectorAll('.teamMember').forEach((teamMember, idx) => {
      const thisPokemon = game.player.team.members[idx];
      const indexNumber = teamMember.dataset.index;
      teamMember.addEventListener('click', async () => {
        if (!thisPokemon.alive) {
          return;
        }
        await this.hidePokemonSelection();
        if (thisPokemon === game.player.currentPokemon) {
          game.player.choosePokemon(indexNumber);
          this.enableMoveSelection();
          return;
        }
        await this.preparePlayerPokemonImage();
        game.player.choosePokemon(indexNumber);
      });
    });
    game.pokemonListSetupCompleted = true;
  }
  async preparePlayerPokemonImage() {
    return new Promise((resolve, reject) => {
      const image = document.querySelector('#playerPokemonImage');
      image.style.transition = 'all 0s';
      image.style.opacity = 0;
      image.style.borderTop = '50px solid #ff0000';
      image.style.borderLeft = '50px solid #ddd';
      image.style.borderRight = '50px solid #ff0000';
      image.style.borderBottom = '50px solid #ddd';
      image.style.width = '130px';
      image.style.transform = 'rotate(-45deg)';
      image.style.marginLeft = '-150px';
      image.style.marginBottom = '-100px';
      setTimeout(() => {
        resolve(), 500;
      });
    });
  }
  updateImageAndName(pokemon) {
    const pokemonImage = document.querySelector(`#${pokemon.team}PokemonImage`);
    const pokemonName = document.querySelector(`#${pokemon.team}PokemonName`);
    pokemonName.innerHTML = pokemon.name.toUpperCase();
    if (pokemon.team === 'player') {
      pokemonImage.src = pokemon.backSprite;
    } else {
      pokemon.resetHealthBar(100, 'computer-health-bar');
      pokemonImage.style.width = '340px';
      pokemonImage.style.opacity = 1;
      pokemonImage.src = pokemon.frontSprite;
    }
  }
  showPokemonSelection() {
    game.pokemonMenuVisible = true;
    const pokemonMenu = document.querySelector('.eight');
    pokemonMenu.style.opacity = 1;
    pokemonMenu.style.display = 'flex';
  }
  hidePokemonSelection() {
    const pokemonMenu = document.querySelector('.eight');
    pokemonMenu.style.opacity = 0;
    pokemonMenu.style.display = 'none';
    game.pokemonMenuVisible = false;
  }
  calculateDamage(moveData, attacker, opponent) {
    const level = 10;
    const attack = attacker.stats.attack;
    const defence = opponent.stats.defense;
    const opponentType = opponent.types;
    const { power, accuracy, type, damageMultipliers } = moveData;
    if (!power) {
      return 0;
    }
    const typeEffectMultiplier = this.calculateTypeEffectMultiplier(
      opponentType,
      damageMultipliers
    );
    const damage =
      ((((2 * level) / 5 + 2) * power * (attack / defence)) / 50 + 2) *
      typeEffectMultiplier;
    return damage;
  }
  calculateTypeEffectMultiplier(opponentTypes, damageMultipliers) {
    const typeMultipliers = opponentTypes.map((type) => {
      const damageMultiplier = Object.keys(damageMultipliers).filter(
        (multiplier) => {
          return damageMultipliers[multiplier].includes(type);
        }
      );
      return damageMultiplier;
    });

    const translateToMultiplier = typeMultipliers.map((multiplier) => {
      if (multiplier[0] === 'doubleDamage') {
        game.battle.specialDamageMessage = 'was super effective against';
        game.battle.damageAnimation = 1200;
        return 2;
      } else if (multiplier[0] === 'halfDamage') {
        game.battle.specialDamageMessage = 'was not very effective against';
        game.battle.damageAnimation = 50;
        return 0.5;
      } else if (multiplier[0] === 'noDamage') {
        game.battle.specialDamageMessage = 'had no effect on';
        game.battle.damageAnimation = 0;
        return 0;
      } else {
        game.battle.specialDamageMessage = null;
        game.battle.damageAnimation = 500;
        return 1;
      }
    });
    let totalMultiplier = translateToMultiplier.reduce(
      (total, current) => total * current,
      1
    );
    if (totalMultiplier > 2) {
      totalMultiplier = 2;
    }
    return totalMultiplier;
  }

  async finalBattleDialogue(opponent) {
    await UpdateDialogueBox(
      `Good job, you defeated ${toSentenceCase(
        opponent.name
      )} and saved Pikachu...`,
      'dialogueBox'
    );
  }

  async nextBattleDialogue(opponent) {
    await UpdateDialogueBox(
      `You defeated ${toSentenceCase(
        opponent.name
      )}...now go and help Pikachu...`,
      'dialogueBox'
    );
  }

  disableMoveSelection() {
    const moveClickHandlers = document.querySelectorAll('.move');
    moveClickHandlers.forEach((move) => {
      move.style.display = 'none';
    });
  }

  enableMoveSelection() {
    const moveClickHandlers = document.querySelectorAll('.move');
    moveClickHandlers.forEach((move) => (move.style.display = ''));
  }
}
