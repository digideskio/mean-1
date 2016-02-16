'use strict';

var Nightmare = require('nightmare'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    request = require('request');

mongoose.connect('mongodb://localhost/bookingScraper');

var bookingSchema = mongoose.Schema({
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

var Booking = mongoose.model('Booking', bookingSchema);

// reset everything
//Booking.remove({}, function(err) {
//    if (err) console.log(err);
//});

var nightmare = new Nightmare();

var urls = [],
    results = [],
    imageCounter = 0;

nightmare
    .use(getUrls())
    .use(logUrls())
    .use(showResults())
    .run(done);

function getUrls () {
    return function(nightmare) {
        nightmare
            .goto('http://florida.arrests.org/?results=1400')
            .wait()
            .evaluate( function () {
                var $ = jQuery;
                var names = $('.search-results .profile-card .title a').map(function() { return $(this).attr('href'); });
                return $.makeArray(names);
            }, function(result) {
                urls = result;
            });
    }
}

function logUrls () {
    return function(nightmare) {
        urls.forEach(function(url) {
            var base = 'http://florida.arrests.org';
            url = base + url; //.substring(0, url.length - 4);
            console.log(url);
            nightmare
                .goto(url)
                .inject('js', 'jquery.min.js')
                .wait()
                .evaluate( function (base) {
                    $.fn.justText = function() { return $(this).clone().children().remove().end().text().trim();};
                    return {
                        givenName: $('span[itemprop="givenName"]').text().trim(),
                        additionalName: $('span[itemprop="additionalName"]').text().trim(),
                        familyName: $('span[itemprop="familyName"]').text().trim(),
                        date: $('.date time').attr('datetime'),
                        arrestAge: $('span[itemprop="age"]').text().trim(),
                        gender: $('span[itemprop="gender"]').text().trim(),
                        birthDate: $('span[itemprop="birthDay"]').attr('content'),
                        height: $('b:contains("Height:")').parent().justText(),
                        weight: $('b:contains("Weight:")').parent().justText(),
                        image: base + $('img[itemprop="image"]').attr('src'),
                        charges: $.makeArray($('div.charge-title').map(function() { return $(this).justText() }))

                    };
                }, function (result) {
                    // download and compare image
                    result.filename = '../public/images/' + result.givenName + '-'
                        + result.familyName + '-' + imageCounter + '.jpg';

                    download(result.image, result.filename , function(err) {
                        if (err) {
                            console.log('Didn\'t have an image', err);
                        } else {
                            imageCounter++
                            console.log('Done downloading.. -- Booking #' + imageCounter);
                            saveToDatabase(result)
                            results.push(result);
                        }
                    });
                }, base)
        });
    };
};

function saveToDatabase(result) {
    var booking = new Booking;

    booking.fullName = buildFullName(result);
    booking.date = result.date;
    booking.arrestAge = result.arrestAge;
    booking.gender  = result.gender;
    booking.birthDate = result.birthDate;
    booking.height = result.height;
    booking.weight = result.weight;
    booking.image = result.filename;
    booking.charges = result.charges;

    booking.save(function(err, booking) {
        if (err) console.log(err);
        console.log('Saved booking');
    });
};

// http://stackoverflow.com/questions/12740659/downloading-images-with-node-js
var download = function(uri, filename, callback){

    request.head(uri, function(err, res, body){

        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        if (err) callback(err);
        if (res.headers['content-length'] == 4254 || res.headers['content-length'] == 4263) {
            callback('skip');
        } else {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        }

    });
};

function showResults () {
    return function(nightmare) {
        console.log(results);
    }
}

function buildFullName (result) {
    return result.givenName + ' ' + (result.additionalName ? result.additionalName + ' ' + result.familyName : result.familyName)
}

function done() {
    mongoose.connection.close();
}