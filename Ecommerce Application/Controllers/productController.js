import ProductModel from "../Models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await ProductModel.create(req.body);
    res.json({
      success: true,
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//! Get a Product

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById({ _id: id });
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//! Get All Product

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json({ success: true, products });
  } catch (error) {
    throw new Error(error);
  }
});

//! Update Product

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateSingleProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    res.json({ success: true, updateSingleProduct });
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSingleProduct = await ProductModel.findOneAndDelete({
      _id: id,
    });
    res.json({ success: true, deleteSingleProduct });
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
