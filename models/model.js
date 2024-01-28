const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

    device: {
        required: true,
        type: String
    },
    serialNumber: {
        required: true,
        type: String
    },
    fillLevel: {
        required: true,
        type: Number
    },
    timestamp:{
        required: true,
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Data', dataSchema);