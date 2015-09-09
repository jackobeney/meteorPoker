Meteor.publish('bets', function() {
  return Bets.find()
});
var bigBlind = 10;
var smallBlind = 5;

// Meteor.setInterval(function(){
//   bigBlind = bigBlind * 2;
//   smallBlind = smallBlind * 2;
// }, 10000);

Meteor.methods({
  'setBlinds' : function() {
    Bets.remove({});
    var blinds = {
      bigBlind: bigBlind,
      smallBlind: smallBlind
    }
    Bets.insert({pot: bigBlind + smallBlind, minBet: bigBlind})
    return blinds;
  },

  'foldPlayer' : function(player) {
    PlayerList.update({_id: player}, {$set: {folded: true}});
  },

  'minRaise' : function(player) {
    var minBet = Bets.findOne().minBet;
    var currentPot = Bets.findOne().pot;
    var currentPlayerStack = PlayerList.findOne({_id: player}).stack;
    Bets.update({}, {$set: {pot: currentPot + minBet}});
    PlayerList.update({_id: player}, {$set: {stack: currentPlayerStack - minBet}});
  },

  'allIn' : function(player) {
    var currentPlayerStack = PlayerList.findOne({_id: player}).stack;
    var currentPot = Bets.findOne().pot;
    Bets.update({}, {$set: {pot: currentPot + currentPlayerStack}});
    PlayerList.update({_id: player}, {$set: {stack: 0}});
  }
});