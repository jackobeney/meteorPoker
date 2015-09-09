Meteor.publish('players', function() {
  return PlayerList.find()
});

Meteor.startup(function () {
  ServiceConfiguration.configurations.remove({
    service: "google"
  });
  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: "1046641895734-fua6o6njm1hbjm738dhksgoitfuqjuvd.apps.googleusercontent.com",
    secret: "dbtu-goDPLo4d-b7jgmfAYjp"
  });
});

Meteor.methods({
  'addPlayers' : function() {
    PlayerList.remove({});
    var players = Meteor.users.find({});
    players.forEach(function(player) {
      var name = player.services.google.given_name;
      PlayerList.insert({_id: player._id, name: name, stack: 3000, folded: false});
    });
  }
});