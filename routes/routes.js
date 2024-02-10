const express = require('express');
const Model = require('../models/model');
const router = express.Router()
router.use(express.json());


//generate a new device
router.post('/generate', async (req, res) => {
    try {
        const { deviceId, deviceSerialNumber, trashType, localisation, carType, fillLevel } = req.body;
        const existingDevice = await Model.findOne({ DeviceId: deviceId });
        if (existingDevice) {
            return res.status(400).json({ message: 'device with this id  exists!' });
        }
        const newDevice = new Model({
            DeviceId: deviceId,
            SerialNumber: deviceSerialNumber,
            TrashType: trashType,
            FillLevel: fillLevel,
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
        res.json({ device });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});

//get all devices
router.get('/allDevices', async (req, res) => {
    try {
        const devices = await Model.find({});
        res.json({ devices });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//update a specefic device
router.post('/deviceDetails/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { fillLevel, lastEmptyDate, trashType, localisation, tComment, lastAPIUse, codeName, lastMaintenanceDate, carType, lon, lat, status, imgPath } = req.body;
        if (!deviceId) {
            return res.status(400).json({ message: 'deviceId is required' });
        }

        // Function to validate the date format
        const validateDateFormat = (dateString) => {
            const dateFormatRegex = /^\d{1,2}\/\d{1,2}\/\d{2}$/;
            return dateFormatRegex.test(dateString);
        };

        const validateDateFormat2 = (dateString) => {
            const dateFormatRegex = /^\d{1,2}\/\d{1,2}\/\d{2}\s-\s\d{1,2}:\d{1,2}\s-\s\{\s\d{1,2}\s:\s\d{1,2}\s\}$/;
            return dateFormatRegex.test(dateString);
        };

        // Validate lastEmptyDate
        if (lastEmptyDate && !validateDateFormat(lastEmptyDate)) {
            return res.status(400).json({ message: 'Invalid date format for lastEmptyDate. The correct format is D / M / YY' });
        }

        // Validate LastMaintenanceDate
        if (lastMaintenanceDate && !validateDateFormat(lastMaintenanceDate)) {
            return res.status(400).json({ message: 'Invalid date format for lastMaintenanceDate. The correct format is D / M / YY' });
        }

        // Validate lastAPIUse
        if (lastAPIUse && !validateDateFormat2(lastAPIUse)) {
            return res.status(400).json({ message: 'Invalid date format for lastAPIUse. The correct format is D / M / YY - 00:00 - { 00 : 00 }' });
        }

        // Construct updateFields object
        const updateFields = {};
        if (fillLevel) updateFields.FillLevel = fillLevel;
        if (status) updateFields.Status = status;
        if (imgPath) updateFields.ImagePath = imgPath;
        if (lastEmptyDate) updateFields.LastEmptyDate = lastEmptyDate;
        if (trashType) updateFields.TrashType = trashType;
        if (localisation) updateFields.Localisation = localisation;
        if (tComment) updateFields.TComment = tComment;
        if (lastAPIUse) updateFields.LastAPIUse = lastAPIUse;
        if (codeName) updateFields.CodeName = codeName;
        if (lastMaintenanceDate) updateFields.LastMaintenanceDate = lastMaintenanceDate;
        if (carType) updateFields.CarType = carType;
        if (!updateFields.geo_point) {
            updateFields.geo_point = {};
        }
        if (lat) updateFields.geo_point.Lat = lat;
        if (lon) updateFields.geo_point.Lon = lon;

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


// Delete a specific device by deviceId
router.delete('/delete/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;

        // Find and delete the device
        const deletedDevice = await Model.findOneAndDelete({ DeviceId: deviceId });

        // Check if the device exists
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({ message: 'Device deleted successfully', device: deletedDevice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;