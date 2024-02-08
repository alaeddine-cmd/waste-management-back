const express = require('express');
const Model = require('../models/model');
const router = express.Router()
router.use(express.json());

//generate a new device
router.post('/generate', async (req, res) => {
    try {
        const { deviceId, deviceSerialNumber, trashType, localisation, carType } = req.body;
        const existingDevice = await Model.findOne({ DeviceId: deviceId });
        if (existingDevice) {
            return res.status(400).json({ message: 'device with this id  exists!' });
        }
        const newDevice = new Model({
            DeviceId: deviceId,
            SerialNumber: deviceSerialNumber,
            TrashType: trashType,
            Localisation: localisation,
            CarType: carType,
        });

        await newDevice.save();
        res.status(201).json({ message: 'success', device: newDevice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});

//get device details by deviceId
router.get('/deviceDetails/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await Model.findOne({ DeviceId: deviceId });
        if (!device) {
            return res.status(404).json({ message: 'device does not exist' });
        }
        res.json({ device});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});



//update device details by deviceId
router.post('/deviceDetails/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const {fillLevel, lastEmptyDate, trashType, localisation, tComment, lastAPIUse, codeName, lastMaintenanceDate, carType } = req.body;
        if (!deviceId) {
            return res.status(400).json({ message: 'deviceId is required' });
        }

        const updateFields = {};
        if (fillLevel) updateFields.FillLevel = fillLevel;
        if (lastEmptyDate) updateFields.LastEmptyDate = lastEmptyDate;
        if (trashType) updateFields.TrashType = trashType;
        if (localisation) updateFields.Localisation = localisation;
        if (tComment) updateFields.TComment = tComment;
        if (lastAPIUse) updateFields.LastAPIUse = lastAPIUse;
        if (codeName) updateFields.CodeName = codeName;
        if (lastMaintenanceDate) updateFields.LastMaintenanceDate = lastMaintenanceDate;
        if (carType) updateFields.CarType = carType;

        const device = await Model.findOneAndUpdate(
            { DeviceId: deviceId },
            updateFields,
            { new: true }
        );

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({ message: 'Device updated successfully', device });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;