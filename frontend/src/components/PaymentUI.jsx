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
  onTransactionComplete,
}) => {
  const [cashInserted, setCashInserted] = useState({});
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState({});
  const cashValues = {
    Coin1THB: { value: 1, display: "1 THB" },
    Coin5THB: { value: 5, display: "5 THB" },
    Coin10THB: { value: 10, display: "10 THB" },
    Note20THB: { value: 20, display: "20 THB" },
    Note50THB: { value: 50, display: "50 THB" },
    Note100THB: { value: 100, display: "100 THB" },
    Note500THB: { value: 500, display: "500 THB" },
    Note1000THB: { value: 1000, display: "1000 THB" },
  };
  const handleCashInput = (value) => {
    setCashInserted((prevCashInserted) => ({
      ...prevCashInserted,
      [value]: (prevCashInserted[value] || 0) + 1,
    }));
  };

  const closeDialog = () => {
    setErr("");
    setSuccess({});
    setCashInserted({});
    onConfirm();
  };

  const handleConfirm = async () => {
    // Calculate the total amount based on the number of each coin/note entered
    let totalAmount = 0;
    for (const [coinType, count] of Object.entries(cashInserted)) {
      totalAmount += cashValues[coinType].value * count;
    }

    try {
      const coinsInserted = {};
      const notesInserted = {};
      // Separate the cash inserted in to types: coins/notes
      for (const [cashType, count] of Object.entries(cashInserted)) {
        if (cashType.includes("Coin")) {
          coinsInserted[cashType] = count;
        } else if (cashType.includes("Note")) {
          notesInserted[cashType] = count;
        }
      }

      const res = await axios.patch(
        `http://localhost:3000/vending-machine/${vendingMachineId}/transaction`,
        {
          coinsInserted: coinsInserted,
          notesInserted: notesInserted,
          vendingMachineId: vendingMachineId,
          productId: productId,
        }
      );

      // close the tab when done processing
      setCashInserted({});
      const changeDetailsString = Object.entries(res.data.changeDetails)
        .map(([type, count]) => `${type}: ${count}`)
        .join("\n");

      const data = {
        title: res.data.msg,
        changeDetails: changeDetailsString,
        total: res.data.totalChangeReturned,
      };
      setSuccess(data);
      onTransactionComplete();
    } catch (error) {
      if (error.response) {
        setErr(error.response.data);
      }
      console.log(error);
    }
  };
  return (
    <div className={`payment-container ${isVisible ? "show" : ""}`}>
      <div className="cash-input-wrapper">
        <div className="cash-inserted-display">
          <span>
            {Object.keys(cashInserted).reduce(
              (total, coinType) =>
                total + cashInserted[coinType] * cashValues[coinType].value,
              0
            )}
            {" of "}
            {price} Baht
          </span>
        </div>
        <div className="cash-inputs-container">
          {Object.keys(cashValues).map((coinType) => (
            <button
              className="cash-input"
              key={coinType}
              onClick={() => handleCashInput(coinType)}
            >
              {cashValues[coinType].display}
            </button>
          ))}
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
