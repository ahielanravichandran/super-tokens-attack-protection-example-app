import { useState } from "react";
import { commonPasswords } from "../../src/security/constants";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";
import { SecurityResponse } from "../../src/security/types";
type BruteForceButtonProps = {
  targetEmail: string;
};

const BruteForceButton = ({ targetEmail }: BruteForceButtonProps) => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [result, setResult] = useState<string>("");

  const simulateBruteForce = async () => {
    setIsAttacking(true);
    setResult("Starting brute force attack...");

    for (const password of commonPasswords) {
      try {
        setResult(`Trying password: ${password}`);

        const response = await signIn({
          formFields: [
            { id: "email", value: targetEmail },
            { id: "password", value: password },
          ],
        });

        if (response.status === "OK") {
          setResult(`🔓 Account hacked! Password found: ${password}`);
          setIsAttacking(false);
          return;
        } else if (
          (response as unknown as SecurityResponse).status === "GENERAL_ERROR"
        ) {
          setResult(
            `🛡️ Attack blocked: ${
              (response as unknown as SecurityResponse).message
            }`
          );
          setIsAttacking(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error("Attack attempt failed:", err);
      }
    }

    setResult("❌ Failed to crack password");
    setIsAttacking(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px auto",
        maxWidth: "400px",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h3>Security Demo</h3>
      <p style={{ marginBottom: "10px" }}>
        Test account: test@protect.com / asdfasdf1234567890
      </p>
      <button
        onClick={simulateBruteForce}
        disabled={isAttacking}
        style={{
          padding: "10px 20px",
          backgroundColor: isAttacking ? "#ccc" : "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isAttacking ? "not-allowed" : "pointer",
        }}
      >
        {isAttacking ? "Attacking..." : "Simulate Brute Force Attack"}
      </button>
      {result && (
        <div
          style={{
            marginTop: "10px",
            color: result.includes("hacked") ? "#ff4444" : "#666",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
};

export { BruteForceButton };
