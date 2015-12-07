var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('when make move command', function(){

  var given, when, then;

  beforeEach(function(){
    given= [{
      id:"1234",
      gameId: "1",
      event:"GameCreated",
      name:"TheFirstGame",
      userName: "user1",
      timeStamp: "2015.12.02T11:29:44"
    }, {
      id:"12345",
      gameId: "1",
      event:"GameJoined",
      userName: "user2",
      otherUserName: "user1",
      timeStamp: "2015.12.02T11:30:50"
    }];
  });

  describe('on new game', function(){
    it('should allow user to place anywhere on the board',function(){
      when={
        id:"1234",
        gameId: "1",
        comm:"MakeMove",
        userName : "user1",
        x:0,
        y:1,
        side:'X',
        timeStamp: "2015.12.02T11:30:50"
      };
      then=[{
        id:"1234",
        gameId: "1",
        event:"MoveMade",
        userName:"user1",
        name:"TheFirstGame",
        x:0,
        y:1,
        side:'X',
        timeStamp: "2015.12.02T11:30:50"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    })
  });

  describe("on illegal duplicate move", function(){
    it('placing move in same place should be illegal',function(){
      given.push({
        id:"1234",
        event:"MoveMade",
        userName:"user1",
        name:"TheFirstGame",
        x:0,
        y:1,
        side:'X',
        timeStamp: "2015.12.02T11:30:50"
      });

      when={
        id:"1234",
        gameId: "1",
        comm:"MakeMove",
        userName : "user1",
        x:0,
        y:1,
        side:'X',
        timeStamp: "2015.12.02T11:30:50"
      };

      then=[{
        id:"1234",
        gameId: "1",
        event:"IllegalMove",
        userName:"user1",
        name:"TheFirstGame",
        x:0,
        y:1,
        side:'X',
        timeStamp: "2015.12.02T11:30:50"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

    });
  });

   describe("On illegal player duplicate move", function() {
     it("player should not be able to make a move twice in a row", function() {
       given.push({
         id:"1234",
         event:"MoveMade",
         userName:"user1",
         name:"TheFirstGame",
         x:0,
         y:1,
         side:'X',
         timeStamp: "2015.12.02T11:30:50"
       });

       when={
         id:"1234",
         gameId: "1",
         comm:"MakeMove",
         userName : "user1",
         x:1,
         y:1,
         side:'X',
         timeStamp: "2015.12.02T11:30:50"
       };
       then=[{
         id:"1234",
         gameId: "1",
         event:"NotYourTurn",
         userName:"user1",
         name:"TheFirstGame",
         x:1,
         y:1,
         side:'X',
         timeStamp: "2015.12.02T11:30:50"
       }];

       var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

       JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

     });
   });

   describe("On horizontal win", function() {
      it("should win when three in a horizontal row", function() {
        given.push({
          id: "1234",
          event: "MoveMade",
          userName: "user1",
          name: "TheFirstGame",
          x: 0,
          y: 0,
          side: "X",
          timeStamp: "2015.12.02T11:30:50"
        });
        given.push({
          id: "12345",
          event: "MoveMade",
          userName: "user2",
          name: "TheFirstGame",
          x: 0,
          y: 1,
          side: "O",
          timeStamp: "2015.12.02T11:30:50"
        });
        given.push({
          id: "1234",
          event: "MoveMade",
          userName: "user1",
          name: "TheFirstGame",
          x: 1,
          y: 0,
          side: "X",
          timeStamp: "2015.12.02T11:30:50"
        });
        given.push({
          id: "12345",
          event: "MoveMade",
          userName: "user2",
          name: "TheFirstGame",
          x: 0,
          y: 2,
          side: "O",
          timeStamp: "2015.12.02T11:30:50"
        });
        when = {
          id: "1234",
          gameId: "1",
          comm: "MakeMove",
          userName: "user1",
          name: "TheFirstGame",
          x: 2,
          y: 0,
          side: "X",
          timeStamp: "2015.12.02T11:30:50"
        };
        then = [{
        id:"1234",
        gameId: "1",
        event:"MoveMade",
        userName: "user1",
        name: "TheFirstGame",
        x: 2,
        y: 0,
        side: "X",
        timeStamp: "2015.12.02T11:30:50"
      },{
        id: "1234",
        gameId: "1",
        event: "GameWon",
        userName: "user1",
        timeStamp: "2015.12.02T11:30:50"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

      });
   });

   describe("On vertical win", function() {
     it("should win when three in a vertical row", function() {
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 0,
         y: 0,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 2,
         y: 0,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 0,
         y: 1,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 1,
         y: 0,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       when = {
         id: "1234",
         gameId: "1",
         comm: "MakeMove",
         userName: "user1",
         name: "TheFirstGame",
         x: 0,
         y: 2,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       };
       then = [{
       id:"1234",
       gameId: "1",
       event:"MoveMade",
       userName: "user1",
       name: "TheFirstGame",
       x: 0,
       y: 2,
       side: "X",
       timeStamp: "2015.12.02T11:30:50"
     },{
       id: "1234",
       gameId: "1",
       event: "GameWon",
       userName: "user1",
       timeStamp: "2015.12.02T11:30:50"
     }];
     var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
     JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
     });
   });

   describe("On diagonal win", function() {
     it("should win when three in a diagonal row", function() {
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 0,
         y: 0,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 1,
         y: 0,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 1,
         y: 1,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 2,
         y: 0,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       when = {
         id: "1234",
         gameId: "1",
         comm: "MakeMove",
         userName: "user1",
         name: "TheFirstGame",
         x: 2,
         y: 2,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       };
       then = [{
       id:"1234",
       gameId: "1",
       event:"MoveMade",
       userName: "user1",
       name: "TheFirstGame",
       x: 2,
       y: 2,
       side: "X",
       timeStamp: "2015.12.02T11:30:50"
     },{
       id: "1234",
       gameId: "1",
       event: "GameWon",
       userName: "user1",
       timeStamp: "2015.12.02T11:30:50"
     }];
     var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
     JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

     });
   });

   describe("On game draw", function() {
     it("should notify users that there is a draw when all places are filled", function() {
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 0,
         y: 0,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 1,
         y: 0,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 0,
         y: 1,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 2,
         y: 0,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 2,
         y: 1,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 1,
         y: 1,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "1234",
         event: "MoveMade",
         userName: "user1",
         name: "TheFirstGame",
         x: 1,
         y: 2,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       });
       given.push({
         id: "12345",
         event: "MoveMade",
         userName: "user2",
         name: "TheFirstGame",
         x: 0,
         y: 2,
         side: "O",
         timeStamp: "2015.12.02T11:30:50"
       });
       when = {
         id: "1234",
         gameId: "1",
         comm: "MakeMove",
         userName: "user1",
         name: "TheFirstGame",
         x: 2,
         y: 2,
         side: "X",
         timeStamp: "2015.12.02T11:30:50"
       };
       then = [{
       id:"1234",
       gameId: "1",
       event:"MoveMade",
       userName: "user1",
       name: "TheFirstGame",
       x: 2,
       y: 2,
       side: "X",
       timeStamp: "2015.12.02T11:30:50"
     },{
       id: "1234",
       gameId: "1",
       event: "GameDraw",
       userName: "user1",
       timeStamp: "2015.12.02T11:30:50"
     }];
     var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
     JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));

     });
   });


});
