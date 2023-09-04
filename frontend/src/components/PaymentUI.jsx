import { useState } from "react";
import axios from "axios";
import "../styles/paymentUI.scss";
import {CASH_VALUES} from "./constant"

export const PaymentUI = ({
  isVisible,
  onConfirm,
  onCancel,
  price,
  vendingMachineId,
  productId,
  onTransactionComplete,
}) => {
  const [cashInserted, setCashInserted] = useState({});
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState({});
  const handleCashInput = (value) => {
    setCashInserted((prevCashInserted) => ({
      ...prevCashInserted,
      [value]: (prevCashInserted[value] || 0) + 1,
    }));
  };
  
  // reset states
  const closeDialog = () => {
    setErr("");
    setSuccess({});
    setCashInserted({});
    onConfirm();
  };

  const handleConfirm = async () => {
    const coinsInserted = {};
    const notesInserted = {};
    // Calculate the total amount based on the number of each coin/note entered
    try {
      // Separate the cash inserted in to types: coins/notes
      for (const [cashType, count] of Object.entries(cashInserted)) {
        if (cashType.includes("Coin")) {
          coinsInserted[cashType] = count;
        } else if (cashType.includes("Note")) {
          notesInserted[cashType] = count;
        }
      }

      const res = await axios.patch(
        `${
          import.meta.env.VITE_API
        }/api/vending-machine/${vendingMachineId}/transaction`,
        {
          coinsInserted: coinsInserted,
          notesInserted: notesInserted,
          vendingMachineId: vendingMachineId,
          productId: productId,
        }
      );

      if (res) {
        //stringify keys and values to show changes (coins and number of coins returnd)
        const changeDetailsString = Object.entries(res.data.changeDetails)
          .map(([type, count]) => `${type}: ${count}`)
          .join("\n");

        // packing change data into object to display
        const data = {
          title: res.data.msg,
          changeDetails: changeDetailsString,
          total: res.data.totalChangeReturned,
        };

        // close the tab and reset coins inserted when done processing
        setCashInserted({});
        setSuccess(data);
        
        //re-fetchInventory in case stock = 0
        onTransactionComplete();
      }
    } catch (error) {
      if (error.response) {
        setErr(error.response.data);
      }
      console.log(error);
    }
  };

  return (
    // Show Payment tabs when product selected
    <div className={`payment-container ${isVisible ? "show" : ""}`}>
      <div className="cash-input-wrapper">
        {/* display amount inserted */}
        <div className="cash-inserted-display">
          <span>
            {Object.keys(cashInserted).reduce(
              (total, coinType) =>
                total + cashInserted[coinType] * CASH_VALUES[coinType].value,
              0
            )}
            {" of "}
            {price} Baht
          </span>
        </div>
        <div className="cash-inputs-container">
          {/* cash by buttons */}
          {Object.keys(CASH_VALUES).map((coinType) => (
            <button
              className="cash-input"
              key={coinType}
              onClick={() => handleCashInput(coinType)}
            >
              {CASH_VALUES[coinType].display}
            </button>
          ))}
          {/* reset button */}
          <button
            className="cash-input"
            onClick={() => {
              setCashInserted({});
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="payment-actions">
        <button className="confirm-payment" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="cancel-payment" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {/* after transaction dialog */}
      {success.title && (
        <>
          <div className="overlay"></div>
          <div className="dialog">
            <h3>{success.title}</h3>
            {success.total > 0 && (
              <>
                <h5>Cash Returned:</h5>
                <p className="cash-returned">{success.changeDetails}</p>
                <h5>Total Change:</h5>
                <p>{success.total} THB </p>
              </>
            )}
            <button className="dialog-actions" onClick={closeDialog}>
              OK
            </button>
          </div>
        </>
      )}
      {/* failed transaction dialog */}
      {err && (
        <>
          <div className="overlay"></div>
          <div className="dialog">
            <p className>{err}</p>
            <button className="dialog-actions" onClick={closeDialog}>
              OK
            </button>
          </div>
        </>
      )}
    </div>
  );
};
