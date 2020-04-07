async function getPokemonData(pokemonNumber) {
  const pokemonResults = await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
    .catch((e) => {
      game.connectionIssues();
      return;
    });
  const rawStats = pokemonResults.data.stats;
  pokemonResults.types = pokemonResults.data.types.map(
    (type) => type.type.name
  );
  pokemonResults.stats = {};
  for (stat of rawStats) {
    pokemonResults.stats[stat.stat.name] = stat.base_stat;
  }
  pokemonResults.moves = pokemonResults.data.moves.map((move) => move.move);
  return pokemonResults;
}

async function getMoveData(url, moveName) {
  const moveResults = await axios.get(url).catch((e) => {
    const backupMoveData = {
      name: moveName,
      power: 50,
      accuracy: 100,
      type: 'normal',
      damageMultipliers: {
        doubleDamage: [],
        halfDamage: [],
        noDamage: [],
      },
      connectionIssues: true,
    };
    return backupMoveData;
  });
  if (moveResults.connectionIssues) {
    return moveResults;
  }
  const move = {
    name: moveResults.data.name,
    power: moveResults.data.power,
    accuracy: moveResults.data.accuracy,
    type: moveResults.data.type.name,
    damageMultipliers: await getMoveTypeEffects(moveResults.data.type.url),
  };
  return move;
}

async function getMoveTypeEffects(url) {
  const moveTypeEffects = await axios.get(url).catch((e) => {
    const backUpTypeEffects = {
      doubleDamage: [],
      halfDamage: [],
      noDamage: [],
      connectionIssues: true,
    };
    return backUpTypeEffects;
  });
  if (backUpTypeEffects.connectionIssues) {
    return moveTypeEffects;
  }
  const typeEffects = {
    doubleDamage: moveTypeEffects.data.damage_relations.double_damage_to.map(
      (type) => type.name
    ),
    halfDamage: moveTypeEffects.data.damage_relations.half_damage_to.map(
      (type) => type.name
    ),
    noDamage: moveTypeEffects.data.damage_relations.no_damage_to.map(
      (type) => type.name
    ),
  };
  return typeEffects;
}
