//sample test file: i only cover a few cases

const { updateProduct } = require("../controllers/ProductsController");
const { Product } = require("../models/modelCollection");
const httpMocks = require("node-mocks-http");

jest.mock("../models/modelCollection", () => ({
  Product: {
    findByPk: jest.fn(),
    update: jest.fn(),
  },
}));

let req, res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("Product Controller", () => {
  it("should update price", async () => {
    Product.findByPk.mockResolvedValue(1);
    Product.update.mockResolvedValue([1]);
    req.params = { productId: 1 };
    req.body = {
      price: 20,
    };
    await updateProduct(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Product with id 1 has been updated");
  });

  it("should return product not found", async () => {
    Product.findByPk.mockResolvedValue(1);
    Product.update.mockResolvedValue([0]);
    req.params = { productId: 1 };
    req.body = {
      price: 20,
    };
    await updateProduct(req, res);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getData()).toBe("Product not found");
  });

});
