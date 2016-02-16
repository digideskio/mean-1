var mongoose = require('mongoose'),
    async = require('async');

require('../app/models/booking.server.model');

mongoose.connect('mongodb://localhost/mean-development');

var Booking = mongoose.model('Booking');

Booking.find({}, function(err, bookings) {
    async.eachSeries(bookings, function (booking, callback) {
        var imgParts = booking.image.split('/');
        booking.image = imgParts[3];
        booking.save(function(err, booking) {
            console.log(booking.image);
            callback();
        })
    }, function(err) {
        done();
    });
})

Booking
    .find({})
    .sort({'rating': -1})
    .limit(10)
    .exec(function(err, results) {
        console.log(results);
        done();
    });

function done() {
    mongoose.connection.close();
}