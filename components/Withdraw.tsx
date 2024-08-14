import { useState } from "react";

function Withdraw() {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleWithdraw = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/account/withdraw", {
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
        `Withdrawal successful! New balance: $${data.balance.toFixed(2)}`
      );
      setAmount(0); // Reset amount after successful withdrawal
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError(`Withdrawal failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Make a Withdrawal</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min="0"
        step="0.01"
      />
      <button onClick={handleWithdraw} disabled={isLoading || amount <= 0}>
        {isLoading ? "Processing..." : "Withdraw"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Withdraw;
