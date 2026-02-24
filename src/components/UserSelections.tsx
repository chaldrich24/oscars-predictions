import { useEffect, useRef, useState } from "react";
import { Options } from "react-select";
import SelectionItem from "./SelectionItem";
import { useParams } from "react-router-dom";
import {
  getEntry,
  getEntryFromToken,
  validateGetEntry,
} from "../lib/supabaseClient";
import { GROUPS } from "../data/CategoryGroupings";

type Option = { value: string; label: string };

export type UserSelectionsDetails = {
  category_id: string;
  category_name: string;
  slug: string;
  points: number;
  nominee: string;
  winner: string | null;
  nomineesList: string[];
};

export type UserSelectionsObj = {
  name: string;
  user_id: string;
  selections: UserSelectionsDetails[];
};

export type UserSelectionsProps = {
  userSelections: UserSelectionsObj;
};

function UserSelections() {
  const { userId, name } = useParams();
  const [userSelections, setUserSelections] =
    useState<UserSelectionsObj | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleVerify = async () => {
    validateGetEntry({ user_id: userId, pin: pin })
      .then((data) => {
        console.log("Fetched entry data:", data);
        setUserSelections({ ...data.data, name: name ? name : "Unknown User" });
        localStorage.setItem(`edit_token_${userId}`, data.token);
        localStorage.setItem(`edit_token_exp_${userId}`, data.expiresAt);

        setShowPinModal(false);
        setPin("");
      })
      .catch((err) => {
        console.error("Error fetching entry data:", err);
        setError("Failed to load user selections.");

        setShowPinModal(false);
        setPin("");
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem(`edit_token_${userId}`);
    const expiration = localStorage.getItem(`edit_token_exp_${userId}`);
    const currenDateTime = new Date().toISOString();
    if (token && expiration && currenDateTime < expiration) {
      getEntryFromToken({ user_id: userId, token })
        .then((data) => {
          setUserSelections({
            ...data.data,
            name: name ? name : "Unknown User",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching entry from token:", err);
          setError("Failed to load user selections.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const selections = userSelections?.selections ?? [];

  const bySlug = Object.fromEntries(selections.map((p) => [p.slug, p]));

  const currentPoints = selections.reduce((acc, sel) => {
    return sel.nominee === sel.winner ? acc + sel.points : acc;
  }, 0);

  if (error) return <div style={{ padding: 16, color: "white" }}>{error}</div>;
  if (loading)
    return <div style={{ padding: 16, color: "white" }}>Loading...</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginBottom: 25,
      }}
    >
      <div style={styles.profileHeader} className="nine">
        <h1>
          {name} <span>Points: {selections ? currentPoints : 0}</span>
        </h1>
      </div>
      {userSelections ? (
        <div style={styles.container}>
          {GROUPS.map((g) => (
            <section key={g.title} style={{ marginBottom: 16 }}>
              <h3
                style={{
                  margin: "10px 0",
                  opacity: 0.85,
                  color: "rgb(174, 155, 91)",
                }}
              >
                {g.title}
              </h3>

              <div style={{ display: "grid", gap: 10 }}>
                {g.slugs.map((slug) => {
                  const pick = bySlug[slug];
                  if (!pick) return null;
                  const nominees: Options<Option> = pick.nomineesList.map(
                    (nom, index) => ({
                      value: nom,
                      label: nom,
                    }),
                  );

                  return (
                    <SelectionItem
                      key={slug}
                      nominees={nominees}
                      pick={pick}
                      slug={slug}
                      user_id={userSelections.user_id}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div
          style={{
            ...styles.container,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <p className="locked-text">
            Picks are private until Sun, March 15, 2026, 6:00 PM EST.
          </p>
          <p className="locked-text">
            Want to make changes? Press the button below.
          </p>
          <button
            className="main-btn"
            onClick={() => setShowPinModal(true)}
            style={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
                verticalAlign: "bottom",
                marginTop: "4px",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              Enter PIN to Edit
            </div>
          </button>
        </div>
      )}
      {showPinModal && (
        <div className="modal-overlay">
          <div
            className="modal"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Enter PIN</h3>

            <input
              type="password"
              value={pin}
              onChange={(e) => {
                // keep only digits, max 4
                const digitsOnly = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 4);
                setPin(digitsOnly);
              }}
              placeholder="4-digit PIN"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />

            {error && <div className="error">{pinError}</div>}

            <div
              className="modal-actions"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <button
                style={styles.modalBtn}
                className="btn-iphone-styles"
                onClick={handleVerify}
              >
                Submit
              </button>
              <button
                className="btn-iphone-styles"
                style={styles.modalBtn}
                onClick={() => {
                  setShowPinModal(false);
                  setPin("");
                  setPinError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: 600,
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "column" as "column",
    marginTop: 10,
    width: "80%",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
    textTransform: "uppercase",
  },

  sub: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    opacity: 0.6,
    color: "white",
  },
  nomineeContainer: {
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  modalBtn: {
    borderRadius: 12,
    backgroundColor: "rgb(174, 155, 91)",
    color: "#818181",
    border: "none",
    cursor: "pointer",
    padding: "10px 12px",
    fontWeight: 600,
    textShadow: "0px 1px 1px rgba(0,0,0,0.4)",
    WebkitTextFillColor: "#ffffff",
  },
};

export default UserSelections;
