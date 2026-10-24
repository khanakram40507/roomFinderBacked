
const User = require("../models/user.model");
const mongoose = require("mongoose");
const Property = require("../models/property.model");
const Subscription = require("../models/subscription.model");

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    // The user ID comes from the verified JWT.
    const user = await User.findById(req.user.userId).select(
      "-password"
    );
      const properties = await Property.find({
      owner: user._id,
      status: "published",
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      properties,
    });
  } catch (error) {
    console.error("Get user details error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

// GET /api/users geting all users

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Fetch public profile details
    const user = await User.findById(id)
      .select("name role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch only published properties belonging to this user
    const properties = await Property.find({
      owner: user._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean();

    // Count valid buyer subscriptions to this seller
    let subscriberCount = 0;

    if (user.role === "seller") {
      subscriberCount = await Subscription.countDocuments({
        subscribedTo: user._id,
      });
    }

    // Check whether the logged-in buyer subscribes to this seller
    let isSubscribed = false;

    if (req.user?.userId && user.role === "seller") {
      isSubscribed = Boolean(
        await Subscription.exists({
          subscriber: req.user.userId,
          subscribedTo: user._id,
        })
      );
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          subscriberCount,
        },
        isSubscribed,
        properties,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};


module.exports = { getMe, getAllUsers,getUserDetails };
