var unirest = require('unirest');

var hutchison = require('hutchison');

var pokerRanking = require('poker-ranking');

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
  let rank = hand.rank != '10'
    ? hand.rank
    : 'T'
  return rank + hand.suit[0]
}

raiseAtLeast = function(gameState, amount) {
  return gameState.minimum_raise > amount
    ? gameState.minimum_raise
    : parseInt(amount);
}

holdMax = function(gameState, amount) {
  return gameState.minimum_raise < amount
    ? gameState.minimum_raise
    : parseInt(amount);
}

class Player {
  static get VERSION() {
    return '0.5';
  }

  static betRequest(gameState, bet) {
    if(gameState.players[2].status=="active"){
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
      console.log('COMMUNITY', communityCards.length);

      if (playerCount(gameState) == 1) {
        console.log('Csak mi vagyunk, tartunk');
        bet(gameState.minimum_raise ? gameState.minimum_raise : 0);
        return;
      }


      // Flop után és csak 2en vagyunk
      if ( communityCards.length > 0 && playerCount(gameState) < 4 ) {
//      if ( 0 ) {
        let allCards = handStrings.concat(communityCardsStrings);
        console.log(allCards);
        var evalResults = pokerRanking.evaluateAndFindCards(allCards);
        console.log('Eval Results', evalResults);

        let betAmount = 0;
        let currentChip = gameState.players[2].stack;
        switch(evalResults.match) {
          case "pair":
            betAmount = holdMax(gameState, currentChip * 0.1);
            break;
          case "2pair":
            betAmount = raiseAtLeast(gameState, currentChip * 0.2);
            break;
          case "3ofakind":
            betAmount = raiseAtLeast(gameState, currentChip * 0.3);
            break;
          case "straight":
            betAmount = raiseAtLeast(gameState, currentChip * 0.4);
            break;
          case "flush":
            betAmount = raiseAtLeast(gameState, currentChip * 0.5);
            break;
          case "fullhouse":
          case "4ofakind":
          case "straightflush":
          case "royalflush":
          case "5ofakind":
            betAmount = raiseAtLeast(gameState, currentChip * 0.6);
            break;
          default:
            break;
        }
        bet(betAmount);
      } else {

        let currentChip = gameState.players[2].stack;
        let hutodds = hutchison.texasHoldem({hand: handStrings});
        console.log(hutodds);
        if(hutodds.percentile > 0.9){
          var betAmount = raiseAtLeast(gameState, currentChip * 0.2);
          bet(betAmount);
        }
        else if(hutodds.percentile > 0.70){
          var betAmount = holdMax(gameState, currentChip * 0.05);
          bet(betAmount);
        }else{
          bet(0);
        }
      }
      // Minimum flop
      /* else{
        if(gameState.players[2].time_used < 2000000){
          try {
            unirest.get(
              "https://poker-odds.p.rapidapi.com/hold-em/odds" +
              "?hand=" + encodeURIComponent(handStrings.join(',')) +
              "&community=" + encodeURIComponent(communityCardsStrings.join(',')) +
              "&players=" + playerCount(gameState)
            )
            .header("X-RapidAPI-Key", "8109f8ee60mshce6823ffe4eb41bp13b75ejsn5640ab87f615")
            .timeout(1000)
            .end(function (result) {
              if (result.body) {
                console.log(result.body);
                var winPercent = result.body.win;
                if (winPercent > 0.6) {
                  console.error("raise");
                  var betAmount = gameState.minimum_raise + 100;
                  bet(betAmount);
    //              bet(gameState.players[2].stack);
                  } else if (winPercent > 0.35) {
                  console.error("megad max 100");
                  var betAmount = gameState.minimum_raise > 100
                    ? 100
                    : gameState.minimum_raise;
                  bet(betAmount);
                } else {
                  console.error("dob");
                  bet(0);
                }
              } else {
                console.error('timeout');
                bet(0);
              }
            });
          } catch (error) {
            console.error(error);
            bet(0);
          }
        }else{
          bet(0);
        }
      } */
    
  }else{
    bet(0);
  }
    
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
