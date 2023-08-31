import "../styles/product.scss";
import { useState } from "react";
import { PaymentUI } from "../components/PaymentUI";

export const Product = ({ product }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);

  const handleSelect = () => {
    setShowDialog(true);
    setShowPaymentUI(true)
    document.body.classList.add("no-scroll");
  };

  const closeDialog = () => {
    setShowDialog(false);
    setShowPaymentUI(false)
    document.body.classList.remove("no-scroll");
  };

  const handleConfirm = () => {
    // do api call for transcation
    setShowDialog(false);
  };

  return (
    <div className={"product-container"}>
      <img
        className="product-image"
        src={product.productImage}
        alt={product.productName}
      />
      <div className="product-details">
        <h3>{product.productName}</h3>
        <h3>{product.price} THB</h3>
      </div>
      <button className="select-product" type="button" onClick={handleSelect}>
        SELECT ITEM
      </button>
      {showDialog && (
        <>
          <div className="overlay"></div>
          <div className="confirm-dialogue">
            <p>Are you sure you sure?</p>
            <div className="dialogue-actions">
              <button className="cancel" onClick={closeDialog}>
                Cancel
              </button>
              <button className="confirm" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
          <PaymentUI isVisible={showPaymentUI}/>
        </>
      )}
    </div>
  );
};
