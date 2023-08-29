const { Product } = require("../models/modelCollection");

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      productName: req.body.productName,
      price: req.body.price,
    });
    return res.status(201).send(`${product.productName} added`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.update(
      {
        productName: req.body.productName,
        price: req.body.price,
      },
      {
        where: {
          productId: req.params.productId,
        },
      }
    );
    if (product[0] === 0) {
      return res.status(404).send("Product not found");
    }
    return res
      .status(200)
      .send(`Product with id ${req.params.productId} has been updated`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.destroy({
      where: {
        productId: req.params.productId,
      },
    });
    if (product === 0) {
      return res.status(404).send("Product not found");
    }
    return res.send(`Product with ${req.params.productId} is deleted`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};
