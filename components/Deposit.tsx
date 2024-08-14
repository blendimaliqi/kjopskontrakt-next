import { useState } from "react";

function Deposit() {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDeposit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/account/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred");
      }

      setSuccess(
        `Deposit successful! New balance: $${data.balance.toFixed(2)}`
      );
      setAmount(0); // Reset amount after successful deposit
    } catch (error) {
      console.error("Deposit error:", error);
      setError(`Deposit failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Make a Deposit</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min="0"
        step="0.01"
      />
      <button onClick={handleDeposit} disabled={isLoading || amount <= 0}>
        {isLoading ? "Processing..." : "Deposit"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Deposit;
