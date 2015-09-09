Meteor.subscribe('players');

Template.table.helpers({

  'player': function() {
    return PlayerList.find({}, {sort: {name: 1} })
  }
});

Template.player.helpers({
  'player': function() {
    return PlayerList.find({}, {sort: {name: 1} })
  },

  'playerHand' : function(userId) {
    return PlayerList.findOne({_id: userId}).hand;
  },

  'playerStack': function(userId) {
    return PlayerList.findOne({_id: userId}).stack;
  },

  'getUser' : function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user.services.google.given_name;
  },

  'folded' : function(userId) {
    if(PlayerList.findOne({_id: userId}).folded) return 'disabled'
    return '';
  },

  // 'turnTaken' : function(userId) {

  // }
});

Template.player.events({
  'click .login': function () {
    Meteor.loginWithGoogle({
      requestPermissions: ['email']
    }, function (err) {
      if (err)
        Session.set('errorMessage', err.reason || 'Unknown error');
    });
  },

  'click .fold': function (evt) {
    var player = $(evt.currentTarget).data("id");
    Meteor.call('disablePlayer', player, 'fold');
  },

  'click .check': function (evt) {
    var player = $(evt.currentTarget).data("id");
    Meteor.call('disablePlayer', player, 'check');
  },

  'click .call': function (evt) {
    var player = $(evt.currentTarget).data("id");
    Meteor.call('disablePlayer', player, 'bet');
  },

  'click .min-raise': function (evt) {
    var player = $(evt.currentTarget).data("id");
    Meteor.call('disablePlayer', player, 'bet');
    Meteor.call('minRaise', player);
  },

  'click .all-in': function (evt) {
    var player = $(evt.currentTarget).data("id");
    Meteor.call('disablePlayer', player, 'bet');
    Meteor.call('allIn', player);
  }
});