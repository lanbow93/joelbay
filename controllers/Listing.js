import express from "express";
const router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });
import Listing from "../models/Listing.js";
import fetch from "node-fetch";
import adminAuth from "../middleware/adminAuth.js";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();
// Get all Listings
router.get("/", async (request, response) => {
  console.log(request.query);
  try {
    if (request.query.discount) {
      const Listings = await Listing.findAll({
        where: { discount: { [Sequelize.Op.not]: 0 } },
      });
      response.status(200).json(Listings);
    } else {
      const Listings = await Listing.findAll({});
      if (Listings) {
        response.status(200).json(Listings);
      } else {
        response.status(400).json({ error: "Unable To Find Any Entries" });
      }
    }
  } catch (error) {
    response.status(400).json(error);
  }
});

// Delete specific item
router.delete("/:id", adminAuth, async (request, response) => {
  try {
    const deletedRows = await Listing.destroy(
      { where: { id: request.params.id } },
      { force: true },
    );
    response
      .status(200)
      .json({ message: "Successful Deletion", data: deletedRows });
  } catch (error) {
    response.status(400).json(error);
  }
});

// Creates a new Listing with multer middleware for handling file upload
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
      if (
        imgurApiResponse &&
        imgurApiResponse.data &&
        imgurApiResponse.data.link
      ) {
        return imgurApiResponse.data.link;
      } else {
        throw new Error("Imgur image upload failed");
      }
    });

    // Wait for all Imgur uploads to complete
    const imgurLinks = await Promise.all(imgurUploadPromises);

    // Update the database with the Imgur image links
    const newListing = await Listing.create({
      name: request.body.name,
      description: request.body.description,
      imageUrls: imgurLinks, // Update images to Imgur links
      price: request.body.price,
      quantityAvailable: request.body.quantityAvailable,
      brand: request.body.brand,
      category: request.body.category,
      condition: request.body.condition,
      discount: 0,
    });

    if (newListing) {
      response.status(200).json(newListing);
    } else {
      response
        .status(400)
        .json({ error: "Unable to create record", data: newListing });
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
      method: "POST",
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
      },
      body: image,
    });

    if (response.ok) {
      return response.json();
    } else {
      const errorResponse = await response.json(); // Attempt to parse error response as JSON

      return { error: "Imgur API Error", data: errorResponse };
    }
  } catch (error) {
    return { error: "Imgur API Request Error", data: null };
  }
}

// Update route for an existing Listing
router.put("/:ListingId", upload.any(), async (request, response) => {
  try {
    const ListingId = request.params.ListingId;
    const existingListing = await Listing.findByPk(ListingId);

    if (!existingListing) {
      return response.status(404).json({ error: "Listing not found" });
    }

    // Assuming request.files is an array of uploaded files
    const newImages = request.files;

    // Check if there are any uploaded images
    if (newImages && newImages.length > 0) {
      const imgurUploadPromises = newImages.map(async (image) => {
        // Upload each new image to Imgur
        const imgurApiResponse = await uploadImageToImgur(image.buffer);

        // Check if Imgur upload was successful for each new image
        if (
          imgurApiResponse &&
          imgurApiResponse.data &&
          imgurApiResponse.data.link
        ) {
          return imgurApiResponse.data.link;
        } else {
          throw new Error("Imgur image upload failed");
        }
      });

      // Wait for all Imgur uploads to complete
      const newImgurLinks = await Promise.all(imgurUploadPromises);

      // Combine the existing image URLs with the new Imgur links
      const updatedImageUrls = [...existingListing.imageUrls, ...newImgurLinks];

      // Update the database with the combined image links and other details
      const updatedListing = await existingListing.update({
        name: request.body.name || existingListing.name,
        description: request.body.description || existingListing.description,
        imageUrls: updatedImageUrls,
        price: request.body.price || existingListing.price,
        quantityAvailable:
          request.body.quantityAvailable || existingListing.quantityAvailable,
        brand: request.body.brand || existingListing.brand,
        category: request.body.category || existingListing.category,
        condition: request.body.condition || existingListing.condition,
        discount: request.body.discount || existingListing.discount,
      });

      response.status(200).json(updatedListing);
    } else {
      // No new images, update only other details
      const updatedListing = await existingListing.update({
        name: request.body.name || existingListing.name,
        description: request.body.description || existingListing.description,
        price: request.body.price || existingListing.price,
        quantityAvailable:
          request.body.quantityAvailable || existingListing.quantityAvailable,
        brand: request.body.brand || existingListing.brand,
        category: request.body.category || existingListing.category,
        condition: request.body.condition || existingListing.condition,
        discount: request.body.discount || existingListing.discount,
      });

      response.status(200).json(updatedListing);
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

// Show information
router.get("/:id", async (request, response) => {
  try {
    const SingleListing = await Listing.findAll({
      where: { id: request.params.id },
    });
    response.status(200).json(SingleListing);
  } catch (error) {
    response.status(400).json(error);
  }
});

export default router;
