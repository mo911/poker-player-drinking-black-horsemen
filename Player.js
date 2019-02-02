class Player {
  static get VERSION() {
    return '0.3';
  }

  static betRequest(gameState, bet) {
    console.error(gameState.players[2].hole_cards);
    console.error(gameState);
    bet(gameState.players[2].stack);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
