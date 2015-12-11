'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;
var given = require('../fluid-api/tictactoeFluid').given;
var user = require('../fluid-api/tictactoeFluid').user;


describe('TEST ENV GET /api/gameHistory', function () {

  it('Should have ACCEPTANCE_URL environment variable exported.', function () {
    /*jshint -W030 */
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
