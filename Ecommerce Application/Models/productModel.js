import mongoose from "mongoose";
import bcrypt from "bcrypt";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    // category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    // quantity: Number,
    sold: { type: Number, default: 0 },
    images: { type: Array },
    color: { type: String, required: true },
    brand: { type: String, required: true },
    // color: { type: String, enum: ["Black", "Brown", "Red"] },
    // brand: { type: String, enum: ["Apple", "Samsung", "Lenovo"] },
    rating: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;
