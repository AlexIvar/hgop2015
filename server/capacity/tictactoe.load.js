
var user = require('../fluid-api/tictactoeFluid').user;
var given = require('../fluid-api/tictactoeFluid').given;

it('Should play 100 games in x seconds.', function (done) {
  var doneCount = 0;
  var gamesToPlay = 100;
  var x = 5;

  this.timeout(x * 1000);

  var QED = function () {
    if (gamesToPlay === ++doneCount) {
      done();
    }
  };

  for (var gameId = 0; gameId < gamesToPlay; gameId++) {
    given(user("YourUser").createsGame("" + gameId).named("TheFirstGame"))
    .and(user("OtherUser").joinsGame("" + gameId))
    .and(user("YourUser").placesMove(  0,0, "X"))
    .and(user("OtherUser").placesMove( 1,0, "O" ))
    .and(user("YourUser").placesMove(  2,0, "X"))
    .and(user("OtherUser").placesMove( 0,1, "O" ))
    .and(user("YourUser").placesMove(  2,1, "X"))
    .and(user("OtherUser").placesMove( 1,1, "O" ))
    .and(user("YourUser").placesMove(  1,2, "X"))
    .and(user("OtherUser").placesMove( 2,2, "O" ))
    .and(user("YourUser").placesMove(  0,2, "X"))
    .expect("GameDraw").byUser("YourUser").when(QED);
  }
});
