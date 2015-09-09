Meteor.publish('cardManager', function() {
  return CurrentRound.find({});
});

Meteor.methods({
  'deckConfig' : function() {
    var DeckConfig = {
      Suit: ["Clubs", "Diamonds", "Hearts", "Spades"],
      Rank: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]
    };
    return DeckConfig;
  },

  'unpackDeck' : function() {
    var array = [];
    var DeckConfig = Meteor.call('deckConfig');
    DeckConfig.Suit.forEach(function (suit) {
      DeckConfig.Rank.forEach(function (rank) {
        array.push({
          Suit: suit,
          Rank: rank
        });
      });
    });

    return array;
  },

  'shuffleDeck': function() {
    var array = Meteor.call('unpackDeck'),
    currentIndex = array.length,
    temporaryValue,
    randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

  'dealHand' : function() {
    CurrentRound.remove({});
    var shuffledDeck = Meteor.call('shuffleDeck');
    var players = PlayerList.find({});
    players.forEach(function(player) {
      var hand = shuffledDeck.splice(0,2);
      PlayerList.update({_id: player._id}, {$set: {hand: hand}});
    });
    CurrentRound.insert({deck: shuffledDeck});
    return shuffledDeck;
  },

  'tableCards' : function(roundOfBetting, cards) {
    var currentRound = CurrentRound.find({});
    var currentDeck = CurrentRound.find({}, {fields: {'deck':1}}).fetch().pop().deck;
    var roundCards = currentDeck.splice(0,cards);
    currentRound.forEach(function(round) {
      currentDeck = currentDeck.concat(currentDeck.splice(0,cards));
      if(roundOfBetting === 'flop') {
        CurrentRound.update({deck: round.deck}, {$set: {flop: roundCards}});
      } else if(roundOfBetting === 'turn'){
        CurrentRound.update({deck: round.deck}, {$set: {turn: roundCards}});
      } else {
        CurrentRound.update({deck: round.deck}, {$set: {river: roundCards}});
      }
      CurrentRound.update({deck: round.deck}, {$set: {deck: currentDeck}});
    });
  },
});