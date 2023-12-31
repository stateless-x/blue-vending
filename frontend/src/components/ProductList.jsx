import { Product } from "./Product";
import { useState, useEffect } from "react";
import "../styles/product.scss";
import axios from "axios";
export const ProductList = () => {
  const [products, setProducts] = useState([]);

  const vendingMachineId = 1; //displaying only 1 vending machine
  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/api/vending-machine/${vendingMachineId}`
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
      <div className="header-container">
        <h1 className="header">Blue Vending</h1>
        <h5 className="subheader">Fulfull your belly with happiness</h5>
      </div>
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
