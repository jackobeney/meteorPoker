Meteor.publish('game', function() {
  return CurrentGame.find({});
});

Meteor.methods({
  'newGame': function() {
    Meteor.call('addPlayers');
    Meteor.call('newRound');
  },

  'newRound': function() {
    Meteor.call('dealHand');
    Meteor.call('setBlinds');
  }

})