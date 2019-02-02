class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    console.error(gameState);
    bet(1000);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
