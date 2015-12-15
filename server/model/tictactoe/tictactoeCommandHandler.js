'use strict';

var _ = require('lodash');

module.exports = function tictactoeCommandHandler(events) {
  var gameState = {
    gameCreatedEvent : events[0],
    board: [['','',''],['','',''],['','','']],
    totalMoves: 0,
    currentSide : "X"
  };

  var eventHandlers={
    'MoveMade': function(event){
      gameState.board[event.x][event.y] = event.user.side;
      if(event.user.side === "X") gameState.currentSide= "O";
      else gameState.currentSide= "X";
      gameState.totalMoves += 1;
    }
  };

  _.each(events, function(event){
    var eventHandler = eventHandlers[event.event];
    if(eventHandler) eventHandler(event);
  });

  var hasWon = function(cmd) {
        var sum = 0;
        // Vertical check
        for (var i = 0; i < 3; ++i) {
            if (gameState.board[cmd.x][i] === cmd.user.side) sum++;
        }

        if (sum === 2) return true;

        sum = 0;
        i = 0;
        // Horizontal check
        for (i = 0; i < 3; ++i) {
            if (gameState.board[i][cmd.y] === cmd.user.side) sum++;
        }

        if (sum === 2) return true;

        sum = 0;
        i = 0;
        // Diagonal check
        for ( i = 0; i < 3; ++i) {
            if (gameState.board[i][i] === cmd.user.side) sum++;
        }
        if (sum === 2) return true;
        sum = 0;
        for (var x = 2, y = 0; x > -1 && y < 3; --x, ++y) {
            if (gameState.board[x][y] === cmd.user.side) sum++;
        }
    };

    var isDraw = function(cmd) {
      if(gameState.totalMoves === 9) return true;
    };



  var handlers = {
    "CreateGame": function (cmd) {
      {
        return [{
          id: cmd.id,
          gameId: cmd.gameId,
          event: "GameCreated",
          //userName: cmd.userName,
          user: cmd.user,
          timeStamp: cmd.timeStamp,
          name: cmd.name

        }];
      }
    },
    "JoinGame": function (cmd) {
      {
        if (gameState.gameCreatedEvent === undefined) {
          return [{
            id: cmd.id,
            gameId: cmd.gameId,
            event: "GameDoesNotExist",
            //userName: cmd.userName,
            user: cmd.user,
            timeStamp: cmd.timeStamp
          }];
        }
        return [{
          id: cmd.id,
          gameId: cmd.gameId,
          event: "GameJoined",
          //userName: cmd.userName,
          //otherUserName: gameState.gameCreatedEvent.userName,
          user: cmd.user,
          timeStamp: cmd.timeStamp
        }];
      }
    },
    "MakeMove": function(cmd){
      gameState.totalMoves++;
      if(gameState.board[cmd.x][cmd.y] !== ''){
        return [{
          id: cmd.id,
          gameId: cmd.gameId,
          event: "IllegalMove",
          //userName: cmd.userName,
          user: cmd.user,
          name:gameState.gameCreatedEvent.name,
          x:cmd.x,
          y:cmd.y,
        //  side:cmd.side,
          timeStamp: cmd.timeStamp
        }]
      }
      console.log("user:" + cmd.user.side);
      console.log("currSide:" + gameState.currentSide);
      if(cmd.user.side !== gameState.currentSide){
        return [{
          id: cmd.id,
          gameId: cmd.gameId,
          event: "NotYourTurn",
          //userName: cmd.userName,
          user: cmd.user,
          name:gameState.gameCreatedEvent.name,
          x:cmd.x,
          y:cmd.y,
        //  side:cmd.side,
          timeStamp: cmd.timeStamp
        }]
      }

      var result = [{
        id: cmd.id,
        gameId: cmd.gameId,
        event: "MoveMade",
        //userName: cmd.userName,
        user: cmd.user,
        name:gameState.gameCreatedEvent.name,
        x:cmd.x,
        y:cmd.y,
      //  side:cmd.side,
        timeStamp: cmd.timeStamp
      }];

      if (hasWon(cmd)) {
          result.push({
            id: cmd.id,
            gameId: cmd.gameId,
            event: "GameWon",
            //userName: cmd.userName,
            user: cmd.user,
            timeStamp: cmd.timeStamp
        });
      }
      if (isDraw(cmd)) {
          result.push({
            id: cmd.id,
            gameId: cmd.gameId,
            event: "GameDraw",
            //userName: cmd.userName,
            user: cmd.user,
            timeStamp: cmd.timeStamp
          });
      }

     return result;
    }
  };

  return {
    executeCommand: function (cmd) {
      var handler = handlers[cmd.comm];
      if(!handler){
        throw new Error("No handler resolved for command " + JSON.stringify(cmd));
      }
      return handler(cmd);
    }
  };
};
