const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');

// Get all instruments
router.get("/", async(request, response) => {
    try {
        const Instruments = await Instrument.findAll({});
        if(Instruments){
            response.status(200).json(Instruments);
        } else {
            response.status(400).json({error: "Unable To Find Any Entries"});
        }
    } catch (error) {
        response.status(400).json(error);
    }
})

// Delete specific item
router.delete("/:id", async(request, response) => {
    try {
        const deletedRows = await Instrument.destroy({where:{id: request.params.id}}, {force: true});
        response.status(200).json({message: "Successful Deletion", data: deletedRows});
    } catch (error) {
        response.status(400).json(error);
    }
})

// Creates a new instrument
router.post("/", async(request, response) => {
    try{
        const newInstrument = await Instrument.create({
            name: request.body.name,
            description: request.body.description,
            imageUrl: request.body.imageUrl,
            price: request.body.price,
            quantityAvailable: request.body.quantityAvailable,
            brand: request.body.brand,
            category: request.body.category,
            condition: request.body.condition
        });

        if(newInstrument){
            response.status(200).json(newInstrument);
        } else {
            response.status(400).json({error: "Unable to create record", data: newInstrument});
        }
    } catch(error){
        response.status(400).json(error);
    }
})

// Updates an instrument
router.put("/:id", async (request, response) => {
    try {
        const newInstrument = await Instrument.update(
            {
            name: request.body.name,
            description: request.body.description,
            imageUrl: request.body.imageUrl,
            price: request.body.price,
            quantityAvailable: request.body.quantityAvailable,
            brand: request.body.brand,
            category: request.body.category,
            condition: request.body.condition
            },
            {where: {id: request.params.id}}
        )
        if(newInstrument){
            response.status(200).json(newInstrument);
        }else{
            response.status(400).json({error: "Failed To Update Instrument", data: newInstrument})
        }
    
    } catch (error) {
        response.status(400).json(error);
    }
})

module.exports = router;