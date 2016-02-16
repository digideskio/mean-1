var mongoose = require('mongoose'),
    random = require('mongoose-simple-random'),
    async = require('async');

var mongooseSource = mongoose.createConnection('mongodb://localhost/bookingScraper');
var mongooseDest = mongoose.createConnection('mongodb://localhost/mean-development');


var BookingSourceSchema = new mongoose.Schema({
    fullName: String,
    date: String,
    arrestAge: String,
    gender: String,
    birthDate: String,
    height: String,
    weight: String,
    image: String,
    charges: [String]
});

var BookingSource = mongooseSource.model('Booking', BookingSourceSchema);

var BookingDestSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name cannot be blank'
    },
    rating: {
        type: Number,
        default: 1000
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    date: String,
    arrestAge: String,
    gender: String,
    birthDate: String,
    height: String,
    weight: String,
    image: String,
    charges: [String]
});

BookingDestSchema.plugin(random);

var BookingDest = mongooseDest.model('Booking', BookingDestSchema);

BookingDest.remove(function() {
    console.log('Removed destination documents');
});

BookingSource.find(function(err, results) {
    async.eachSeries(results, function (result, callback) {
        var booking = new BookingDest({
            name: result.fullName,
            date: result.date,
            arrestAge: result.arrestAge,
            gender: result.gender,
            birthDate: result.birthDate,
            height: result.height,
            weight: result.weight,
            image: result.image,
            charges: result.charges
        });

        booking.save(function(err, booking){
            if (err) console.log(err);
            //console.log('booking saved: ', booking.name);
            callback();
        });


    }, function (err) {
        if (err) console.log(err);

        BookingDest.count({}, function(err, count) {
            if (err) console.log(err);
            console.log('All finished with ' + count + ' documents.');
            mongoose.disconnect();
        });
    });
});


