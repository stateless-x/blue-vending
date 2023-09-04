import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/manage.scss";

export const Manage = () => {
  const [cashDetails, setCashDetails] = useState({});
  const [products, setProducts] = useState([]);
  const vendingMachineId = 1;

  const fetchMachineDetails = async () => {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_API}/api/vending-machine/${vendingMachineId}/cash`
      );
      setCashDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInventory = async () => {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_API}/api/vending-machine/${vendingMachineId}`
      );
      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMachineDetails();
    fetchInventory();
  }, []);

  return (
    <div className="manage-bg">
      <div className="dashboard-wrapper">
        <div className="cash-section">
          <h2>Finance 💰</h2>
          <h5>Total Cash: {cashDetails.currentCash} THB</h5>
          <div className="cash-item">
            <div>
              {cashDetails.coinStock
                ? Object.entries(cashDetails.coinStock).map(
                    ([key, value], index) => (
                      <p key={index}>
                        {key}:
                        <span
                          className={value === 0 ? "out-of-stock" : "available"}
                        >
                          {" "}
                          {value}
                        </span>
                      </p>
                    )
                  )
                : "Loading..."}
            </div>
            <div>
              {cashDetails.noteStock
                ? Object.entries(cashDetails.noteStock).map(
                    ([key, value], index) => (
                      <p key={index}>
                        {key}:
                        <span
                          className={value === 0 ? "out-of-stock" : "available"}
                        >
                          {" "}
                          {value}
                        </span>
                      </p>
                    )
                  )
                : "Loading..."}
            </div>
          </div>
        </div>
        <hr />
        <div className="stock-section">
          <h2>Stock 📦</h2>
          <div className="stock-items">
            {products.length !== 0
              ? products.map((product) => (
                  <div key={product.id}>
                    <p>
                      Name: <span>{product.productName}</span>
                    </p>
                    <p className="spacing">
                      Stock:{" "}
                      <span
                        className={
                          product.stock === 0 ? "out-of-stock" : "available"
                        }
                      >
                        {product.stock}
                      </span>
                    </p>
                  </div>
                ))
              : "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};
