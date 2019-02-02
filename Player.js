var unirest = require('unirest');

playerCount = function(gameState) {
  let counter = 0;
  gameState.players.forEach(element => {
    if(element.status == "active"){
      counter++;
    }
  });
  return counter;
}

handToString = function(hand) {
  return hand.rank + hand.suit[0]
}

class Player {
  static get VERSION() {
    return '0.4';
  }

  static betRequest(gameState, bet) {
    let highCards = ['A','K','Q','J'];

    console.error('PlayerCount', playerCount(gameState));
    var hand = gameState.players[2].hole_cards;
    var communityCards = gameState.community_cards;
    console.error(hand);

    var handStrings = [];
    hand.forEach(card => {
      handStrings.push(handToString(card));
    });
    var communityCardsStrings = [];
    communityCards.forEach(card => {
      communityCardsStrings.push(handToString(card));
    })

    // PÁR van - All-in
    if(hand[0].rank == hand[1].rank){
      bet(gameState.players[2].stack);
      console.error("all-in");
    }
    else{
      try {
        unirest.get(
          "https://poker-odds.p.rapidapi.com/hold-em/odds" +
          "?hand=" + encodeURIComponent(handStrings.join(',')) +
          "&community=" + encodeURIComponent(communityCardsStrings.join(',')) +
          "&players=4"
        )
        .header("X-RapidAPI-Key", "8109f8ee60mshce6823ffe4eb41bp13b75ejsn5640ab87f615")
        .end(function (result) {
          console.log(result.body);
          var winPercent = result.body.win;
          if (winPercent > 0.3) {
            console.error("all-in");
            bet(gameState.players[2].stack);
          } else if (winPercent > 0.2) {
            console.error("megad");
            bet(gameState.minimum_raise);
          } else {
            console.error("dob");
            bet(0);
          }
        });
      } catch (error) {
        console.error(error);
        bet(0);
      }


      /* if(highCards.includes(hand[0].rank) && highCards.includes(hand[1].rank)){
        bet(gameState.players[2].stack);
      }else{
        bet(0);
      } */
    }
    
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
