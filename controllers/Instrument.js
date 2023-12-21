import express from 'express';
const router = express.Router();
import multer from 'multer'
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
import Instrument from '../models/Instrument.js';
import fetch from 'node-fetch';
import adminAuth from '../middleware/adminAuth.js';
import dotenv from 'dotenv';

dotenv.config();
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

// Creates a new instrument with multer middleware for handling file upload
router.post("/", upload.any(), adminAuth, async (request, response) => {
  try {
    // Assuming request.files is an array of uploaded files
    console.log("Received Data:", request.body);
    const images = request.files;
    // Check if there are any uploaded images
    if (!images || images.length === 0) {
      return response.status(400).json({ error: "No images uploaded" });
    }

    const imgurUploadPromises = images.map(async (image) => {
      // Upload each image to Imgur
      const imgurApiResponse = await uploadImageToImgur(image.buffer);

      // Check if Imgur upload was successful for each image
      if (imgurApiResponse && imgurApiResponse.data && imgurApiResponse.data.link) {
        return imgurApiResponse.data.link;
      } else {
        throw new Error("Imgur image upload failed");
      }
    });

    // Wait for all Imgur uploads to complete
    const imgurLinks = await Promise.all(imgurUploadPromises);

    // Update the database with the Imgur image links
    const newInstrument = await Instrument.create({
      name: request.body.name,
      description: request.body.description,
      imageUrls: imgurLinks, // Update images to Imgur links
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
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});
  
  // Function to upload an image to Imgur
  async function uploadImageToImgur(image) {
  const imgurApiUrl = `https://api.imgur.com/3/image`;
  const imgurClientId = process.env.CLIENTID;

  try {

    const response = await fetch(imgurApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
      },
      body: image,
    });

    if (response.ok) {
      return response.json();
    } else {
      const errorResponse = await response.json(); // Attempt to parse error response as JSON

      return { error: 'Imgur API Error', data: errorResponse };
    }
  } catch (error) {
    return { error: 'Imgur API Request Error', data: null };
  }
}


// Update route for an existing instrument
router.put("/:instrumentId", upload.any(), adminAuth, async (request, response) => {
  try {
    const instrumentId = request.params.instrumentId;
    const existingInstrument = await Instrument.findByPk(instrumentId);

    if (!existingInstrument) {
      return response.status(404).json({ error: "Instrument not found" });
    }

    // Assuming request.files is an array of uploaded files
    const newImages = request.files;

    // Check if there are any uploaded images
    if (newImages && newImages.length > 0) {
      const imgurUploadPromises = newImages.map(async (image) => {
        // Upload each new image to Imgur
        const imgurApiResponse = await uploadImageToImgur(image.buffer);

        // Check if Imgur upload was successful for each new image
        if (imgurApiResponse && imgurApiResponse.data && imgurApiResponse.data.link) {
          return imgurApiResponse.data.link;
        } else {
          throw new Error("Imgur image upload failed");
        }
      });

      // Wait for all Imgur uploads to complete
      const newImgurLinks = await Promise.all(imgurUploadPromises);

      // Combine the existing image URLs with the new Imgur links
      const updatedImageUrls = [...existingInstrument.imageUrls, ...newImgurLinks];
      
      // Update the database with the combined image links and other details
      const updatedInstrument = await existingInstrument.update({
        name: request.body.name || existingInstrument.name,
        description: request.body.description || existingInstrument.description,
        imageUrls: updatedImageUrls,
        price: request.body.price || existingInstrument.price,
        quantityAvailable: request.body.quantityAvailable || existingInstrument.quantityAvailable,
        brand: request.body.brand || existingInstrument.brand,
        category: request.body.category || existingInstrument.category,
        condition: request.body.condition || existingInstrument.condition,
      });

      response.status(200).json(updatedInstrument);
    } else {
      // No new images, update only other details
      const updatedInstrument = await existingInstrument.update({
        name: request.body.name || existingInstrument.name,
        description: request.body.description || existingInstrument.description,
        price: request.body.price || existingInstrument.price,
        quantityAvailable: request.body.quantityAvailable || existingInstrument.quantityAvailable,
        brand: request.body.brand || existingInstrument.brand,
        category: request.body.category || existingInstrument.category,
        condition: request.body.condition || existingInstrument.condition,
      });

      response.status(200).json(updatedInstrument);
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});


// Show information
router.get("/:id", async (request, response) => {
  try{
    const instrument = await Instrument.findAll({where: {id: request.params.id}});
    response.status(200).json(instrument)
  } catch(error){
    response.status(400).json(error);
  }
})

export default router