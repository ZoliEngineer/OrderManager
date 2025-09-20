import React, { useEffect, useState } from "react";
import config from "./config"; // API_HOST config
import "./App.css";

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyMessage, setBuyMessage] = useState(null);

  // Load stock list once
  useEffect(() => {
    fetch(`${config.API_HOST}/stocks`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stocks:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const openBuyModal = (ticker) => {
    setSelectedTicker(ticker);
    setQuantity("");
    setBuyMessage(null);
    setShowModal(true);
  };

  const handleConfirmBuy = () => {
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      setBuyMessage({ type: "error", text: "Please enter a valid quantity." });
      return;
    }

    fetch(`${config.API_HOST}/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: selectedTicker, quantity: Number(quantity) }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        } else {
          return "Order accepted";
        }
      })
      .then(() => {
        setBuyMessage({ type: "success", text: `Successfully bought ${quantity} shares of ${selectedTicker}` });
      })
      .catch((err) => {
        setBuyMessage({ type: "error", text: `Error: ${err.message}` });
      });
  };

  if (loading) return <div className="loading">Loading market data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">Market Data</h1>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stock.name}</td>
              <td>${Number(stock.price).toFixed(2)}</td>
              <td>
                <button className="buy-btn" onClick={() => openBuyModal(stock.ticker)}>
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Buy {selectedTicker}</h2>
            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleConfirmBuy}>Confirm</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
            {buyMessage && (
              <div className={buyMessage.type === "success" ? "success" : "error"}>
                {buyMessage.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;