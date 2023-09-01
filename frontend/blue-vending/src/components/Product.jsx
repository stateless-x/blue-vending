import "../styles/product.scss";
import { useState, useEffect } from "react";
import { PaymentUI } from "../components/PaymentUI";

export const Product = ({ product, vendingMachineId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);
  const [stock, setStock] = useState(product.stock);
  const handleSelect = () => {
    setShowDialog(true);
    setShowPaymentUI(true);
    document.body.classList.add("no-scroll");
  };

  useEffect(() => {
    setStock(product.stock);
  }, [product.stock]);

  const closeDialog = () => {
    setShowDialog(false);
    setShowPaymentUI(false);
    document.body.classList.remove("no-scroll");
  };

  const handleConfirm = async () => {
    setShowDialog(false);
  };

  return (
    <div className={"product-container"}>
      {stock <= 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      <img
        className="product-image"
        src={product.productImage}
        alt={product.productName}
      />
      <div className="product-details">
        <h3>{product.productName}</h3>
        <h3>{product.price} THB</h3>
      </div>
      <button
        className={`select-product ${stock <= 0 ? "disabled-button" : ""}`}
        type="button"
        onClick={handleSelect}
        disabled={stock <= 0 ? "true" : ""}
      >
        SELECT ITEM
      </button>
      {showDialog && (
        <>
          <div className="overlay"></div>
          <PaymentUI
            isVisible={showPaymentUI}
            onConfirm={handleConfirm}
            onCancel={closeDialog}
            price={product.price}
            vendingMachineId={vendingMachineId}
            productId={product.productId}
          />
        </>
      )}
    </div>
  );
};
