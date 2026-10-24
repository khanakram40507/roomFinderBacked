const express = require("express");
const router = express.Router();

const {
  getMe,
  getAllUsers,
  getUserDetails,
} = require("../controllers/user.controller");


const {
  subscribeUser,
  unsubscribeUser,
  getSubscriptionStats,
} = require("../controllers/subscription.controller");

const {
  protect,
  allowRoles,
} = require("../middleware/auth.middleware");



// this route is for geting the userdetails 
router.get("/:id", getUserDetails);

// Get the currently logged-in user's details
router.get("/me", protect, getMe);

// Get all users — admin only
router.get("/", protect, allowRoles("admin"), getAllUsers);


router.post("/:id/subscribe", protect, subscribeUser);

router.delete("/:id/subscribe", protect, unsubscribeUser);

router.get("/:id/subscription-stats", getSubscriptionStats);


module.exports = router;