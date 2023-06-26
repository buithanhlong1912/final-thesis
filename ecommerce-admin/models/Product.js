const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  images: String,
  price: { type: Number, required: true },
  category: String,
  countInStock: Number,
});

export const Product = models.Product || model("Product", ProductSchema);
