import { useState } from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

export default function PinInput({
    pin,
    setPin
}) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div style={{ position: "relative", width: 240 }}>
      <input
        style={{marginBottom: 12, padding: 12}}
        type={showPin ? "text" : "password"}
        placeholder="PIN"
        value={pin}
        inputMode="numeric"
        pattern="\d*"
        maxLength={4}
        onChange={(e) => {
          // keep only digits, max 4
          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);
          setPin(digitsOnly);
        }}
      />

      <button
        type="button"
        onClick={() => setShowPin((s) => !s)}
        style={{
          position: "absolute",
          right: 40,
          top: 4,
          height: 34,
          width: 34,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.15)",
          background: "#d9d9d9",
          cursor: "pointer",
        }}
        aria-label={showPin ? "Hide PIN" : "Show PIN"}
      >
        <span>{!showPin ? <FaEye /> : <FaEyeSlash />}</span>
      </button>
    </div>
  );
}
