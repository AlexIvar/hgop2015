'use strict';

var _ = require('lodash');

module.exports = function tictactoeCommandHandler(events) {
  var gameState = {
    gameCreatedEvent : events[0],
    board: [['','',''],['','',''],['','','']],
    totalMoves: 0
  };

  var eventHandlers={
    'MoveMade': function(event){
      gameState.board[event.x][event.y] = event.side;
      gameState.totalMoves += 1;
    }
  };

  _.each(events, function(event){
    var eventHandler = eventHandlers[event.event];
    if(eventHandler) eventHandler(event);
  });

  const HasWon = function(cmd) {
        let sum = 0;
        // Vertical check
        for (let i = 0; i < 3; ++i) {
            if (gameState.board[cmd.x][i] === cmd.side) sum++;
        }

        if (sum === 2) return true;

        sum = 0;
        // Horizontal check
        for (let i = 0; i < 3; ++i) {
            if (gameState.board[i][cmd.y] === cmd.side) sum++;
        }

        if (sum === 2) return true;

        sum = 0;
        // Diagonal check
        for (let i = 0; i < 3; ++i) {
            if (gameState.board[i][i] === cmd.side) sum++;
        }
        if (sum === 2) return true;
        sum = 0;
        for (let x = 2, y = 0; x > -1 && y < 3; --x, ++y) {
            if (gameState.board[x][y] === cmd.side) sum++;
        }
    };

    const isDraw = function(cmd) {
      if(gameState.totalMoves === 9) return true;
    };



  var handlers = {
    "CreateGame": function (cmd) {
      {
        return [{
          id: cmd.id,
          gameId: cmd.gameId,
          event: "GameCreated",
          userName: cmd.userName,
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
            event: "GameDoesNotExist",
            userName: cmd.userName,
            timeStamp: cmd.timeStamp
          }];
        }
        return [{
          id: cmd.id,
          event: "GameJoined",
          userName: cmd.userName,
          otherUserName: gameState.gameCreatedEvent.userName,
          timeStamp: cmd.timeStamp
        }];
      }
    },
    "MakeMove": function(cmd){
      gameState.totalMoves++;
      if(gameState.board[cmd.x][cmd.y]!==''){
        return [{
          id: cmd.id,
          event: "IllegalMove",
          userName: cmd.userName,
          name:gameState.gameCreatedEvent.name,
          x:cmd.x,
          y:cmd.y,
          side:cmd.side,
          timeStamp: cmd.timeStamp
        }]
      }
      const result = [{
        id: cmd.id,
        event: "MoveMade",
        userName: cmd.userName,
        name:gameState.gameCreatedEvent.name,
        x:cmd.x,
        y:cmd.y,
        side:cmd.side,
        timeStamp: cmd.timeStamp
      }];

      if (HasWon(cmd)) {
          result.push({
            id: cmd.id,
            event: "GameWon",
            userName: cmd.userName,
            timeStamp: cmd.timeStamp
        });
      }
      if (isDraw(cmd)) {
          result.push({
            id: cmd.id,
            event: "GameDraw",
            userName: cmd.userName,
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
