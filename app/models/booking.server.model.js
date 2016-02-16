'use strict';

var mongoose = require('mongoose'),
    random = require('mongoose-simple-random'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
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

BookingSchema.plugin(random);

mongoose.model('Booking', BookingSchema);