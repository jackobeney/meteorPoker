Meteor.subscribe('table');

Template.table.helpers({

  'getCurrentPot': function() {
    return Bets.findOne({}).pot;
  }

});
