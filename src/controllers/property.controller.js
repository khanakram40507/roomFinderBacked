
const imagekit = require("../config/imagekit");
const Property = require("../models/property.model");
const mongoose = require("mongoose");


// GET /api/properties
// Get all published properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "published",
    })
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};


// GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the MongoDB ID before querying.
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Only return published properties.
    const property = await Property.findOne({
      _id: id,
      status: "published",
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching property:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property details",
    });
  }
};

// POST /api/properties     create property
const createProperty = async (req, res) => {

  try {
    const propertyData =
      typeof req.body.propertyData === "string"
        ? JSON.parse(req.body.propertyData)
        : req.body;

    // Upload images to ImageKit.
    const imageUrls = [];

    for (const file of req.files || []) {
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/roomfinder/properties",
      });

      imageUrls.push(uploadedImage.url);
    }

    // Save the property and its image URLs.
    const property = await Property.create({
      ...propertyData,
      images: imageUrls,
      owner: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Create property error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create property",
    });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
};
