import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  raring: {
    type: Number,
    default: 4.5,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
    // enum:["ikea", "liddy", "caressa", "marcos"]
  },
});

export default mongoose.model("Product", productSchema);
