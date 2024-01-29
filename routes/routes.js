const express = require('express');
const Model = require('../models/model');
const router = express.Router()
router.use(express.json());

router.post('/generateDevice', async (req, res) => {
    try {
        const { deviceName, deviceSerialNumber } = req.body;
        const existingDevice = await Model.findOne({ serialNumber: deviceSerialNumber });
        if (existingDevice) {
            return res.status(400).json({ message: 'device with this serial number exists!' });
        }
        const newDevice = new Model({
            device: deviceName,
            serialNumber: deviceSerialNumber,
            fillLevel: 0,
            timestamp: new Date()
        });

        await newDevice.save();
        res.status(201).json({ message: 'success', device: newDevice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});

router.get('/fillLevel/:serialNumber', async (req, res) => {
    try {
        const { serialNumber } = req.params;
        const device = await Model.findOne({ serialNumber: serialNumber });
        if (!device) {
            return res.status(404).json({ message: 'device does not exist' });
        }
        res.json({ fillLevel: device.fillLevel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});


router.post('/increaseFillLevel', async (req, res) => {

    try {
        const { SerialNumber } = req.body;
        const device = await Model.findOne({
            serialNumber: SerialNumber
        });
        if (!device) {
            return res.status(404).json({ message: 'device doesnt exist' });
        }
        if (device.fillLevel >= 12) {
            return res.status(400).json({ message: 'fill level is already at maximum' });
        }
        device.fillLevel += 1;
        await device.save();
        res.json(device);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});

router.post('/decreaseFillLevel', async (req, res) => {
    try {
        const { SerialNumber } = req.body;
        const updatedData = await Model.findOneAndUpdate(
            { serialNumber: SerialNumber, fillLevel: { $gt: 0 } },
            { $inc: { fillLevel: -1 } },
            { new: true }
        );
        res.json(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'error' });
    }
});

router.post('/fillLevel/:SerialNumber', async (req, res) => {
    try {
        const { SerialNumber } = req.params;
        const { FillLevel } = req.body;
        if (!SerialNumber) {
            return res.status(400).json({ message: 'Serial number is required' });
        }

        // Check if the fillLevel is provided
        if (!FillLevel) {
            return res.status(400).json({ message: 'Fill level is required' });
        }

        // Update the fill level for the device with the provided serial number
        const device = await Model.findOneAndUpdate(
            { serialNumber: SerialNumber },
            { fillLevel: FillLevel },
            { new: true }
        );

        // Check if the device with the provided serial number exists
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Send a success response
        res.json({ message: 'Fill level updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;