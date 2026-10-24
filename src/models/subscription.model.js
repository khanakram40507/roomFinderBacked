
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscribedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can subscribe to another user only once.
subscriptionSchema.index(
  { subscriber: 1, subscribedTo: 1 },
  { unique: true }
);

// Prevent subscribing to yourself.
subscriptionSchema.pre("validate", function () {
  if (this.subscriber.equals(this.subscribedTo)) {
    this.invalidate(
      "subscribedTo",
      "You cannot subscribe to yourself"
    );
  }
});

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);
