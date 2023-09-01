import { Product } from "./Product";
import { PaymentUI } from "./PaymentUI";
import "../styles/product.scss";
import axios from "axios";
import { useState, useEffect } from "react";
export const ProductList = () => {
  const [products, setProducts] = useState([]);

  const vendingMachineId = 1; //displaying only 1 vending machine
  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/vending-machine/${vendingMachineId}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <div className="product-list-container">
        {products.map((product) => (
          <Product
            key={product.productId}
            product={product}
            vendingMachineId={vendingMachineId}
            onStockUpdate={fetchInventory}
          />
        ))}
      </div>
    </>
  );
};
