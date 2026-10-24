
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Subscription = require("../models/subscription.model");

// POST /api/users/:id/subscribe
const subscribeUser = async (req, res) => {
  try {
    const subscriberId = req.user.userId;
    const { id: sellerId } = req.params;

    if (!mongoose.isValidObjectId(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID",
      });
    }

    if (subscriberId.toString() === sellerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot subscribe to yourself",
      });
    }

    // Find the logged-in user and target seller.
    const [subscriber, seller] = await Promise.all([
      User.findById(subscriberId).select("role"),
      User.findById(sellerId).select("role"),
    ]);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber account not found",
      });
    }

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Only buyers can subscribe.
    if (subscriber.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can subscribe to sellers",
      });
    }

    // Only sellers can receive subscriptions.
    if (seller.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "You can subscribe only to sellers",
      });
    }

    await Subscription.create({
      subscriber: subscriber._id,
      subscribedTo: seller._id,
    });

    return res.status(201).json({
      success: true,
      message: "Subscribed to seller successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already subscribed to this seller",
      });
    }

    console.error("Subscribe error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to subscribe",
    });
  }
};

// DELETE /api/users/:id/subscribe
const unsubscribeUser = async (req, res) => {
  try {
    const subscriberId = req.user.userId;
    const { id: subscribedToId } = req.params;

    if (!mongoose.isValidObjectId(subscribedToId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (subscriberId.toString() === subscribedToId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unsubscribe from yourself",
      });
    }

    await Subscription.deleteOne({
      subscriber: subscriberId,
      subscribedTo: subscribedToId,
    });

    return res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to unsubscribe",
    });
  }
};

// GET /api/users/:id/subscription-stats
const getSubscriptionStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [subscriberCount, followingCount] = await Promise.all([
      Subscription.countDocuments({
        subscribedTo: id,
      }),
      Subscription.countDocuments({
        subscriber: id,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        subscriberCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Subscription stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription statistics",
    });
  }
};

module.exports = {
  subscribeUser,
  unsubscribeUser,
  getSubscriptionStats,
};
