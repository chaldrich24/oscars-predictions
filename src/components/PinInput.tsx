import { useState } from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

type PinInputProps = {
    pin: string;
    setPin: React.Dispatch<React.SetStateAction<string>>;
}

export default function PinInput({
    pin,
    setPin
}: PinInputProps) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div style={{ position: "relative", width: 240 }}>
      <input
        style={{marginBottom: 12, padding: 12, background: "var(--section-item-bg)", border: "none", borderRadius: 8, color: "white"}}
        type={showPin ? "text" : "password"}
        className="create-entry-input"
        placeholder="PIN for editing"
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
        className="btn-iphone-styles"
        style={{
          position: "absolute",
          right: 38,
          top: 7,
          height: 25,
          width: 25,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.15)",
          background: "var(--accent)",
          cursor: "pointer",
          color: "#282828",
        }}
        aria-label={showPin ? "Hide PIN" : "Show PIN"}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{!showPin ? <FaEye /> : <FaEyeSlash />}</span>
      </button>
    </div>
  );
}
