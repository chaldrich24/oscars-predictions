import { use, useEffect, useRef, useState } from "react";
import { getLeaderboard, validateUser } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

import { FaPlusCircle } from "react-icons/fa";

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const didRun = useRef(false);
  const posterImageExts = ["jpg", "png", "webp"];

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    getLeaderboard()
      .then((data) => {
        console.log("Fetched leaderboard data:", data);
        setLeaderboardData(data.leaderboard);
      })
      .catch((err) => console.error(err));
  }, []);

  const cleanFileName = (nominee: string) => {
    const cleaned = nominee
      .toLowerCase()
      .replace(/[:\/\\|?<>*"']/g, "") // Remove special characters that are not allowed in file names
      .replace(/\s+/g, "_"); // Replace spaces with underscores
    return cleaned;
  };

  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 25,
      }}
    >
      <button
        className="main-btn"
        onClick={() => navigate("/create-new-entry")}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "15px",
            verticalAlign: "bottom",
            marginTop: "4px",
          }}
        >
          CREATE NEW ENTRY
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaPlusCircle className="plus-icon" />
        </div>
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "Cormorant Garamond, serif",
            color: "white",
          }}
        >
          Leaderboard
        </h2>
        <div style={{ fontSize: 12, opacity: 0.7, color: "white" }}>
          Points update when winners are set. Select your name to edit your
          picks and see your points breakdown.
        </div>
      </div>
      {/* Start of map */}
      {leaderboardData && (
        <div
          style={{
            width: "90%",
            maxWidth: 500,
            margin: "0 auto",
            background: "rgba(255,255,255,0.1)",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 3,
                textAlign: "center",
                flexDirection: "row",
              }}
            >
              <p
                style={{
                  ...styles.title,
                  textAlign: "left",
                  textWrap: "wrap",
                  marginLeft: 6,
                }}
              >
                Name
              </p>
              <p
                style={{
                  ...styles.title,
                  flex: 1,
                  textAlign: "right",
                  textWrap: "wrap",
                }}
              >
                Best Picture
              </p>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <p
                style={{ ...styles.title, textAlign: "right", marginRight: 6 }}
              >
                Score
              </p>
            </div>
          </div>
          {leaderboardData &&
            leaderboardData.map((entry: any, index: number) => (
              <button
                key={index}
                style={{
                  all: "unset",
                  ...styles.row,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  width: "100%",
                }}
                onClick={() => {
                  const pin = prompt(
                    "Enter your 4-digit PIN to view/edit your entry:",
                  );

                  if (!pin) {
                    return;
                  } else {
                    const request = {
                      user_id: entry.user_id,
                      pin: pin,
                    };
                    validateUser(request)
                      .then(() => {
                        navigate(`/user/${entry.user_id}/${entry.name}`);
                      })
                      .catch((err) => {
                        console.error(err);
                        alert("Error validating user: " + err.message);
                      });
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 3,
                    textAlign: "center",
                    flexDirection: "row",
                  }}
                >
                  <p
                    style={{
                      flex: 3,
                      textAlign: "left",
                      textWrap: "wrap",
                      marginLeft: 12,
                    }}
                  >
                    {index + 1}.{" "}
                    <span style={{ fontWeight: "500" }}>{entry.name}</span>
                  </p>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px solid rgba(0, 0, 0, 1)",
                      borderRadius: 4,
                      overflow: "hidden",
                      width: 60,
                    }}
                  >
                    <img
                      src={`/images/${cleanFileName(entry.bestPicture)}.${posterImageExts[0]}`}
                      style={{
                        display: "block",
                        width: "100%",
                        height: 80,
                        objectFit: "cover",
                      }}
                      onError={(e: any) => {
                        const img = e.target;
                        const extIndex = posterImageExts.findIndex((ext) =>
                          img.src.includes(ext),
                        );
                        if (extIndex < posterImageExts.length - 1) {
                          img.src = `/images/${cleanFileName(entry.bestPicture)}.${posterImageExts[extIndex + 1]}`;
                        }
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <p style={{ textAlign: "right", marginRight: 12 }}>
                    {entry.totalPoints}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: {
    marginTop: 0,
    fontSize: 20,
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    paddingBottom: 8,
    fontFamily: "Cormorant Garamond, serif",
    color: "white",
    marginBottom: 1,
  },
  row: {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: "7px 0px",
  },
};

export default Leaderboard;
