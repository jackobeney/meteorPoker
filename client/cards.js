Meteor.subscribe('cardManager');

Template.table.helpers({

  'round': function() {
    return CurrentRound.find({});
  }
});

Template.table.events({
  'click .new-game': function() {
    Meteor.call('newGame');
  },
  'click .deal': function() {
    Meteor.call('newRound');
  },
  'click .flop': function() {
    Meteor.call('tableCards', 'flop', 3);
  },
  'click .turn': function() {
    Meteor.call('tableCards', 'turn', 1);
  },
  'click .river': function() {
    Meteor.call('tableCards', 'river', 1);
  }
});