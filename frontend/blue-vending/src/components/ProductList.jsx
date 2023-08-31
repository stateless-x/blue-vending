import { Product } from "./Product";
import { PaymentUI } from "./PaymentUI";
import "../styles/product.scss";
import axios from "axios";
import { useState, useEffect } from "react";
export const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const vendingMachineId = 1;
        const res = await axios.get(`/vending-machine/${vendingMachineId}`);
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInventory();
  }, []);
  return (
    <>
      <div className="product-list-container">
        {products.map((product) => (
          <Product key={product.productId} product={product} />
        ))}
      </div>
      <PaymentUI />
    </>
  );
};
