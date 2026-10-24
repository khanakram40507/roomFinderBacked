
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["room", "PG", "hotel"],
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      period: {
        type: String,
        enum: ["night", "month"],
        required: true,
      },
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["draft", "published", "unavailable"],
      default: "draft",
    },
    owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
