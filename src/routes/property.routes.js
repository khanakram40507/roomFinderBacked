
const express = require("express");
const router = express.Router();

const {
  getProperties,
  getPropertyById,
  createProperty,
} = require("../controllers/property.controller");

const upload = require("../middleware/upload.middleware");
const {
  protect,
  allowRoles,
} = require("../middleware/auth.middleware");

// Public routes
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// Protected seller route
router.post(
  "/",
  protect,
  allowRoles("seller"),
  upload.array("images", 5),
  createProperty
);

module.exports = router;
