import "../styles/product.scss";
import { useState } from "react";
import { PaymentUI } from "../components/PaymentUI";

export const Product = ({ product, vendingMachineId, onStockUpdate }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);
  
  const handleSelect = () => {
    setShowDialog(true);
    setShowPaymentUI(true);
    document.body.classList.add("no-scroll");
  };

  const closeDialog = () => {
    setShowDialog(false);
    setShowPaymentUI(false);
    document.body.classList.remove("no-scroll");
  };

  const handleConfirm = async () => {
    setShowDialog(false);
    document.body.classList.remove("no-scroll");
  };

  return (
    <div className={"product-container"}>
      {/* show out of stock when no product */}
      {product.stock <= 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      <img
        className="product-image"
        src={product.productImage}
        alt={product.productName}
      />
      <div className="product-details">
        <h3>{product.productName}</h3>
        <h3>{product.price} THB</h3>
      </div>
      {/* don't allow item with 0 stock to be able to selected */}
      <button
        className={`select-product ${product.stock <= 0 ? "disabled-button" : ""}`}
        type="button"
        onClick={handleSelect}
        disabled={product.stock <= 0 ? "true" : ""}
      >
        SELECT ITEM
      </button>
      {/* Show Payment UI after item selection */}
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
            onTransactionComplete={onStockUpdate}
          />
        </>
      )}
    </div>
  );
};
