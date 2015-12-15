var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('join game command', function(){

  var given, when, then;

  it('should join game',function(){
    given= [{
      id:"1234",
      gameId: "1",
      event:"GameCreated",
      userName: "Gulli",
      timeStamp: "2015.12.02T11:29:44"
    }];
    when={
      id:"12345",
      gameId: "1",
      comm:"JoinGame",
      //userName : "Halli",
      user:{
        userName : "Halli",
        side:'O'
      },
      name:"TheFirstGame",
      timeStamp: "2015.12.02T11:30:50"
    };
    then=[{
      id:"12345",
      gameId: "1",
      event:"GameJoined",
      //userName: "Halli",
      user:{
        userName : "Halli",
        side:'O'
      },
      //otherUserName: "Gulli",
      timeStamp: "2015.12.02T11:30:50"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should reject joining of a non-existing game',function(){
    given= [];
    when={
      id:"12345",
      gameId: "1",
      comm:"JoinGame",
      //userName : "Halli",
      user:{
        userName : "Halli",
        side:'O'
      },
      name:"TheFirstGame",
      timeStamp: "2015.12.02T11:30:55"
    };
    then=[{
      id:"12345",
      gameId: "1",
      event:"GameDoesNotExist",
      //userName: "Halli",
      user:{
        userName : "Halli",
        side:'O'
      },
      timeStamp: "2015.12.02T11:30:55"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
