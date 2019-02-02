class Player {
  static get VERSION() {
    return '0.3';
  }

  static betRequest(gameState, bet) {
    console.error(gameState.players[2].hole_cards);
    if(gameState.players[2].hole_cards[0].rank == gameState.players[2].hole_cards[1].rank){
      bet(gameState.players[2].stack);
      console.error("megad");
    }else{
      console.error("dob");
      //bet(gameState.players[2].stack);
      bet(0);
    }
    
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
