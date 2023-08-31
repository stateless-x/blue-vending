import { useState } from "react";
import "../styles/paymentUI.scss";
export const PaymentUI = ({ isVisible }) => {
  return (
    <div className={`payment-container ${isVisible ? "show" : ""}`}>
      PaymentUI
    </div>
  );
};
