const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

    DeviceId: {
        required: true,
        type: String
    },
    SerialNumber: {
        required: true,
        type: String
    },
    FillLevel: {
        required: false,
        type: Number,
        default: 0
    },
    LastEmptyDate: {
        required: false,
        type: String,
    },
    TrashType: {
        required: true,
        type: String
    },

    Localisation: {
        required: true,
        type: String
    },
    TComment: {
        required: false,
        type: String,
        default: "Aucun"
    },
    LastAPIUse: {
        required: false,
        type: String
    },
    CodeName: {
        required: false,
        type: String
    },
    LastMaintenanceDate: {
        required: false,
        type: String
    },
    CarType: {
        required: true,
        type: String
    }
});


module.exports = mongoose.model('Data', dataSchema);