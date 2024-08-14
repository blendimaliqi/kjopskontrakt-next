import { useState, useEffect } from "react";

function Balance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/account/balance", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.statusText}`);
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("ERROR", error);
        setError("Failed to fetch balance. Please try again later.");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <h2>Your Balance</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : balance !== null ? (
        <p>Current balance: ${balance.toFixed(2)}</p>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
}

export default Balance;
