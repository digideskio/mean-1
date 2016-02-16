'use strict';

// Load the test dependencies
var app = require('../../server.js'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    async = require('async'),
    Booking = mongoose.model('Booking');

// create a 'booking' test suite
describe('Battles controller tests:', function() {

    describe.skip('testing to see if controller is wired', function() {
        it('should respond with 200', function(done) {
            request(app)
                .get('/api/battles')
                .expect(200)
                .end(function(err, res) {
                    done();
                });
        })
    });

    describe('two bookings should be returned from a GET request', function() {
        before(function(done) {

            var names = [];

            for (var i = 1; i <= 100; i++) {
                names.push({name: 'name' + i});
            }

            Booking.create(names, function(err, bookings) {
                if (err) done(err);
                done();
            })

        });

        after(function(done) {
            Booking.remove(function() {
                done();
            });
        });

        it('should have 10 bookings in database', function(done) {
           Booking.find({}, function(err, res) {
               if (err) done(err);
               res.should.be.an.Array.and.have.lengthOf(100);
               done();
           })
        });

        it('a battle should have two bookings', function(done) {
            request(app)
                .get('/api/battles')
                .expect(200)
                .end(function (err, bookings) {
                    if (err) throw new Error('Shit exploded');
                    console.log(bookings.body);
                    bookings.body.should.be.an.Array.and.have.lengthOf(2);
                    done();
                })
        });

        describe('expect an even distribution', function() {
            it('distribution should be equal', function(done) {
                this.timeout(200000);

                var names = [],
                    count = 0;

                async.whilst(
                    function() { return count < 10},
                    function(callback) {
                        count++
                        request(app)
                            .get('/api/battles')
                            .expect(200)
                            .end(function(err, bookings) {
                                if (err) return callback(err);
                                bookings.body[0].name.should.not.equal(bookings.body[1].name);
                                names.push(bookings.body[0].name);
                                names.push(bookings.body[1].name);
                                callback();
                            })
                    },
                    function (err) {
                        if (err) return done(err);
                        names.sort();
                        var groups = names.reduce(function(acc, e) {
                            acc[e] = (e in acc ? acc[e] + 1 : 1);
                            return acc }, {});
                        console.log(groups);
                        done();
                    }
                );
            });
        });

    });

    describe('reporting a battle via POST', function() {

        var winner,
            loser;

        before(function(done) {
            Booking.remove(function() {
                done();
            });
        });

        beforeEach(function(done) {

            var names = [];

            for (var i = 1; i <= 100; i++) {
                names.push({name: 'name' + i});
            }

            Booking.create(names, function(err, bookings) {
                if (err) done(err);
            })

            request(app)
                .get('/api/battles')
                .end(function(err, bookings) {
                    if (err) done(err);
                    winner = bookings.body[0]
                    loser = bookings.body[1]
                    done();
                });

        });

        afterEach(function(done) {
            Booking.remove(function() {
                done();
            });
        });

        it('should throw an error if a winner or loser isn\'t posted', function(done) {
            request(app)
                .put('/api/battles')
                .send({winner: winner._id, loser: ''})
                .end(function (err, res) {
                    if (err) done(err);
                    res.body.message.should.have.match(/Voting requires two bookings/);
                    res.status.should.equal(400);
                    done();
                });
        });

        it('should throw an error if a winner or loser isn\'t posted', function(done) {
            request(app)
                .put('/api/battles')
                .send({winner: '', loser: loser._id})
                .end(function(err, res) {
                    if (err) done(err);
                    res.body.message.should.have.match(/Voting requires two bookings/);
                    res.status.should.equal(400);
                    done();
                });
        });

        it('should throw an error if the winner equals the loser', function(done) {
           request(app)
               .put('/api/battles/')
               .send({winner: winner._id, loser: winner._id})
               .end(function (err, res) {
                   if (err) done(err);
                   res.body.message.should.have.match(/Cannot vote for and against the same booking/);
                   res.status.should.equal(400);
                   done();
               })
        });

        it('should return a winner and loser', function(done) {
            request(app)
                .put('/api/battles')
                .send({winner: winner._id, loser: loser._id})
                .end(function (err, res) {
                    if (err) done(err);
                    console.log(res.body);
                    done();
                });
        });


    });

    describe('testing api for battles including GET, UPDATE', function() {
        describe('GET two bookings', function() {
            it('should have two random bookings');
            it('should have two different bookings');
        });

        describe('UPDATE two bookings after battle', function() {
            it('should have a winner and a loser');
            it('should ')
        });
    });


});