const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');

router.get("/", async(request, response) => {
    try {
        const Instruments = Instrument.findAll()
        if(Instruments){
            response.status(200).json(Instruments);
        }
    } catch (error) {
        response.status(400).json(error)
    }
})

module.exports = router;