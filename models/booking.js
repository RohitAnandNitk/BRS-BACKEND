const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bicycleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bicycle',
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    returnDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'returned'],  // Restrict the status to only "ongoing" or "returned"
        default: 'ongoing',  // Default value when booking is created
        required: true
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
