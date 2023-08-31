import { useState } from "react";
import axios from "axios";
import "../styles/paymentUI.scss";
export const PaymentUI = ({
  isVisible,
  onConfirm,
  onCancel,
  price,
  vendingMachineId,
  productId,
}) => {
  const [cashInserted, setCashInserted] = useState({});
  const [processing, setProcessing] = useState(false);
  const cashValues = {
    Coin1THB: { value: 1, display: "+1 THB" },
    Coin5THB: { value: 5, display: "+5 THB" },
    Coin10THB: { value: 10, display: "+10 THB" },
    Note20THB: { value: 20, display: "+20 THB" },
    Note50THB: { value: 50, display: "+50 THB" },
    Note100THB: { value: 100, display: "+100 THB" },
    Note500THB: { value: 500, display: "+500 THB" },
    Note1000THB: { value: 1000, display: "+1000 THB" },
  };
  const handleCashInput = (value) => {
    setCashInserted((prevCashInserted) => ({
      ...prevCashInserted,
      [value]: (prevCashInserted[value] || 0) + 1,
    }));
  };

  const handleConfirm = async () => {
    // Calculate the total amount based on the number of each coin/note entered
    let totalAmount = 0;
    for (const [coinType, count] of Object.entries(cashInserted)) {
      totalAmount += cashValues[coinType].value * count;
    }
    setProcessing(true);
    try {
      const coinsInserted = {};
      const notesInserted = {};
      // Separate the cashInserted object into coinsInserted and notesInserted
      for (const [cashType, count] of Object.entries(cashInserted)) {
        if (cashType.includes("Coin")) {
          coinsInserted[cashType] = count;
        } else if (cashType.includes("Note")) {
          notesInserted[cashType] = count;
        }
      }
      console.log("cashInserted", cashInserted);
      console.log("coinsInserted:", coinsInserted);
      console.log("notesInserted:", notesInserted);
      console.log("vendingMachineId", vendingMachineId);
      console.log("productId:", productId);

      const res = await axios.patch(
        `http://localhost:3000/vending-machine/${vendingMachineId}/transaction`,
        {
          coinsInserted: coinsInserted,
          notesInserted: notesInserted,
          vendingMachineId: vendingMachineId,
          productId: productId,
        }
      );
      console.log("cash inserted: ", cashInserted);
      // close the tab when done processing
      onConfirm();
      setCashInserted({});
      console.log("res: ", res);
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
    setProcessing(false);
  };
  return (
    <div className={`payment-container ${isVisible ? "show" : ""}`}>
      <div className="cash-inserted-display">
        <span>
          Total:{" "}
          {Object.keys(cashInserted).reduce(
            (total, coinType) =>
              total + cashInserted[coinType] * cashValues[coinType].value,
            0
          )}
          {" of "}
          {price} baht
        </span>
      </div>
      <div className="cash-inputs">
        {Object.keys(cashValues).map((coinType) => (
          <button key={coinType} onClick={() => handleCashInput(coinType)}>
            {cashValues[coinType].display}
          </button>
        ))}
      </div>
      <button className="confirm-payment" onClick={handleConfirm}>
        Confirm Payment
      </button>
      <button className="cancel-payment" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};
