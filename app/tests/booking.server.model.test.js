'use strict';

// Load the test dependencies
var app = require('../../server.js'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    Booking = mongoose.model('Booking');

var booking, count;

// create a 'booking' test suite
describe('Booking model unit tests:', function() {


    describe('testing the GET methods', function() {

        before(function(done) {
            booking = new Booking({
                name: 'Name'
            });

            booking.save(function(err) {
                if (err) throw new Error('Booking didn\'t save');
                done();
            });
        });

        after(function(done) {
            Booking.remove(function() {
                done();
            });
        });

       it('should be able to get the list of bookings', function(done) {
           request(app)
               .get('/api/bookings')
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/)
               .expect(200)
               .end(function(err, res) {
                   res.body.should.be.an.Array.and.have.lengthOf(1);
                   res.body[0].should.have.property('name', booking.name);
                   res.body[0].should.have.property('losses', booking.losses);
                   res.body[0].should.have.property('wins', booking.wins);
                   res.body[0].should.have.property('rating', booking.rating);
                   res.body[0].should.have.property('random');
                   res.body[0].random.should.be.an.Array.and.have.lengthOf(2);
                   done();
               });
       });
        it('should get the specific booking', function(done) {
            request(app)
                .get('/api/bookings/' + booking.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.Object.and.have.property('name', booking.name);
                    res.body.should.have.property('rating', booking.rating);
                    res.body.should.have.property('wins', booking.wins);
                    res.body.should.have.property('losses', booking.losses);
                    done();
                })
        })

    });

    describe('Testing post methods', function() {

        before(function(done) {
            booking = new Booking({
                name: 'Name'
            });

            booking.save(function(err) {
                if (err) throw new Error('Booking didn\'t save');
                done();
            });
        });

        after(function(done) {
            Booking.remove(function() {
                done();
            });
        });

        it('should not save a booking without a name', function(done) {
            request(app)
                .post('/api/bookings')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send('name', '')
                .end(function(err, res){
                    res.body.should.have.property('message', 'Validation failed');
                    done();
                })
        });

        it('should save a new booking', function(done) {
            request(app)
                .post('/api/bookings')
                .set('Accept', 'application/json')
                .send({name: 'name2'})
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    console.log(err);
                    if (err) return done(err);
                    res.body.should.be.an.Object.and.have.property('name', 'name2');
                    done();
                });
        });

        it('should get two bookings', function(done) {
            request(app)
                .get('/api/bookings/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.be.an.Array.and.have.lengthOf(2);
                    done();
                });
        });

    });
    describe('testing UPDATE methods', function() {

        before(function(done) {
            booking = new Booking({
                name: 'Name'
            });

            booking.save(function(err) {
                if (err) throw new Error('Booking didn\'t save');
                done();
            });
        });

        after(function(done) {
            Booking.remove(function() {
                done();
            });
        });

        it('should update the booking object', function(done) {
           request(app)
               .put('/api/bookings/' + booking.id)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/)
               .expect(200)
               .send({
                   name: 'jordan',
                   rating: 1200
               })
               .end(function (err, res) {
                   if(err) return done(err);
                   res.body.should.be.an.Object;
                   res.body.should.have.property('name', 'jordan');
                   res.body.should.have.property('rating', 1200);
                   res.body.should.have.property('wins', 0);
                   res.body.should.have.property('losses', 0);
                   done();
               })
        });
    });

    describe('testing DELETE methods', function() {

        before(function(done) {
            booking = new Booking({
                name: 'Name'
            });

            booking.save(function(err) {
                if (err) throw new Error('Booking didn\'t save');
                done();
            });
        });

        after(function(done) {
            Booking.remove(function() {
                done();
            });
        });

        it('should delete a booking', function(done) {
           request(app)
               .delete('/api/bookings/' + booking.id)
               .expect(200)
               .end(function (err, res) {
                   Booking.count(function(err, count) {
                       count.should.equal(0);
                       done();
                   });
               });
        });
    });
});