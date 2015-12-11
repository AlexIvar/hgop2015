'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

const getApiUri = (command) => {
    if (command.comm === "CreateGame") return "/api/createGame";
    else if (command.comm === "JoinGame") return "/api/joinGame";
    else if (command.comm === "MakeMove") return "/api/placeMove";
};

function postCommands(commands, expectations, done)
{
    var command = commands.shift();
    const req = request(acceptanceUrl);
    req
    .post(getApiUri(command))
    .type('json')
    .send(command)
    .end(function (err, res) {
      if (err) return done(err);
      if(commands.length > 0) return postCommands(commands, expectations, done);
      else return reqExpectations(command, expectations, done);
    });
}

function reqExpectations(command, expectations, done)
{
  var expectation = expectations.shift();


  request(acceptanceUrl)
  .get('/api/gameHistory/' +  expectation.gameId)
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function (err, res) {
    if (err) return done(err);
    res.body.should.be.instanceof(Array);
    should(res.body[res.body.length - 1]).match(expectation);
    done();
  });
}

function user(userName){
    const api = {

    createsGame: function(gameId){
      api.gameId = gameId;
      api.comm   = "CreateGame";
      return api;
    },

    joinsGame: function(gameId){
      api.gameId = gameId;
      api.comm   = "JoinGame";
      return api;
    },
    named: function(name) {
     api.name = name;
     return api;
   },

    "placesMove": function(x,y,side){
      api.comm   = "MakeMove"
      api.x      = x;
      api.y      = y;
      api.side   = side;
      return api;
    },

    id : "1234",
    userName: userName,
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"

}
  return api;
}

function given(cmdName){
  const gameId = cmdName.gameId;
  const expectations = [];
  const commands = [cmdName];

  var cmd={
    name:cmdName,
    destination:undefined
  };
  /*const expectation = {};*/

  var givenApi = {
    sendTo: function(dest){
      cmd.destination = dest;
      return givenApi;
    },
    expect: function(eventName){
      expectations.push({event : eventName, gameId : gameId});
      return givenApi;
    },
    and: function(command){
      command.gameId = command.gameId || gameId;
      commands.push(command);
      return givenApi;
    },
    withGameId: function(gameId){
      expectations[expectations.length - 1].gameId = gameId;
      return givenApi;
    },
    byUser: function(userName){
      expectations[expectations.length - 1].userName = userName;
      return givenApi;
    },
    when: function(done){

      return postCommands(commands, expectations,done);

}
};
  return givenApi;
}

module.exports.user = user;
module.exports.given = given;
