const { Product } = require("../models/modelCollection");

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      productName: req.body.productName,
      price: req.body.price,
    });
    res.status(201).send(`${product.productName} added`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
