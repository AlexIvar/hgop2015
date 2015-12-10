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

};
  return api;
};

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


describe('TEST ENV GET /api/gameHistory', function () {

  it('Should have ACCEPTANCE_URL environment variable exported.', function () {
    acceptanceUrl.should.be.ok;
  });

  it('should execute same test using old style', function (done) {

    var command =     {
      id : "1234",
      gameId : "999",
      comm: "CreateGame",
      userName: "Gulli",
      name: "TheFirstGame",
      timeStamp: "2014-12-02T11:29:29"
    };

    var req = request(acceptanceUrl);
    req
      .post('/api/createGame')
      .type('json')
      .send(command)
      .end(function (err, res) {
        if (err) return done(err);
        request(acceptanceUrl)
          .get('/api/gameHistory/999')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            should(res.body).eql(
              [{
                "id": "1234",
                "gameId": "999",
                "event": "GameCreated",
                "userName": "Gulli",
                "name": "TheFirstGame",
                "timeStamp": "2014-12-02T11:29:29"
              }]);
            done();
          });
      });
  });


   it('Should execute fluid API test', function (done) {

     given(user("YourUser").createsGame("999"))
     .expect("GameCreated").withGameId("999").when(done);


   });

   it('Should play game until won or drawn', function (done) {
    given(user("YourUser").createsGame("1234").named("TheFirstGame"))
    .and(user("OtherUser").joinsGame("1234"))
    .and(user("YourUser").placesMove(  0,0, "X"))
    .and(user("OtherUser").placesMove( 1,0, "O" ))
    .and(user("YourUser").placesMove(  2,0, "X"))
    .and(user("OtherUser").placesMove( 0,1, "O" ))
    .and(user("YourUser").placesMove(  2,1, "X"))
    .and(user("OtherUser").placesMove( 1,1, "O" ))
    .and(user("YourUser").placesMove(  1,2, "X"))
    .and(user("OtherUser").placesMove( 2,2, "O" ))
    .and(user("YourUser").placesMove(  0,2, "X"))
    .expect("GameDraw").byUser("YourUser").when(done);
  });

});
