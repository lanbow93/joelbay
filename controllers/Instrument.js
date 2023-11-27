const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');
const adminAuth = require("../middleware/adminAuth")
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
router.delete("/:id", adminAuth, async(request, response) => {
    try {
        const deletedRows = await Instrument.destroy({where:{id: request.params.id}}, {force: true});
        response.status(200).json({message: "Successful Deletion", data: deletedRows});
    } catch (error) {
        response.status(400).json(error);
    }
})

// Creates a new instrument
router.post("/", adminAuth, async (request, response) => {
    try {
      // Assuming request.body.image is a File object (uploaded file)
      const image = request.body.image;
  
      // Upload image to Imgur
      const imgurApiResponse = await uploadImageToImgur(image);
  
      // Check if Imgur upload was successful
      console.log(imgurApiResponse)
      if (imgurApiResponse && imgurApiResponse.data && imgurApiResponse.data.link) {
        // Update the database with the Imgur image link
        const newInstrument = await Instrument.create({
          name: request.body.name,
          description: request.body.description,
          image: imgurApiResponse.data.link, // Update image to Imgur link
          price: request.body.price,
          quantityAvailable: request.body.quantityAvailable,
          brand: request.body.brand,
          category: request.body.category,
          condition: request.body.condition,
        });
  
        if (newInstrument) {
          response.status(200).json(newInstrument);
        } else {
          response.status(400).json({ error: "Unable to create record", data: newInstrument });
        }
      } else {
        response.status(400).json({ error: "Imgur image upload failed", data: imgurApiResponse });
      }
    } catch (error) {
      response.status(400).json(error);
    }
  });
  
  // Function to upload an image to Imgur
  async function uploadImageToImgur(image) {
    const imgurApiUrl = 'https://api.imgur.com/3/image';
    const imgurClientId = 'YOUR_IMGUR_CLIENT_ID'; // Replace with your Imgur client ID
  
    const formData = new FormData();
    formData.append('image', image);
  
    const response = await fetch(imgurApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
      },
      body: formData,
    });
  
    return response.json();
  }

// Updates an instrument
router.put("/:id", adminAuth,  async (request, response) => {
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