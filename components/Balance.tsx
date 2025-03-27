import { useState, useEffect } from "react";

function Balance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    const fetchBalance = async (retryCount = 0) => {
      setIsLoading(true);
      setError(null);
      setIsNewUser(false);

      try {
        const response = await fetch("/api/account/balance", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 && retryCount < 2) {
            // If unauthorized and we haven't retried too many times, wait and retry
            console.log(`Auth error, retrying... (${retryCount + 1})`);
            setTimeout(() => fetchBalance(retryCount + 1), 1000);
            return;
          }
          throw new Error(data.error || "An unknown error occurred");
        }

        setBalance(data.balance);
        if (data.balance === 0 && !data.existingUser) {
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("Balance fetch error:", error);
        setError(`Failed to fetch balance: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading balance...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : balance !== null ? (
        <div>
          <p>{balance.toFixed(2)} kr</p>
          {/* {isNewUser && (
            <p style={{ color: "green" }}>
              Welcome! Your account has been created with an initial balance of
              $0.00.
            </p>
          )} */}
        </div>
      ) : (
        <p>Unable to retrieve balance</p>
      )}
    </div>
  );
}

export default Balance;
