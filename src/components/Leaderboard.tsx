import { useEffect, useRef, useState } from "react";
import { getLeaderboard } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaChevronRight } from "react-icons/fa";

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const didRun = useRef(false);
  const posterImageExts = ["jpg", "png", "webp"];
  const colors = ["#fff", "rgb(174, 155, 91)"];
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % colors.length);
    }, 500);

    const timeout = setTimeout(() => {
      setRunning(false);
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [running, colors.length]);

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
      .replace(/[:\\|?<>*"']/g, "") // Remove special characters that are not allowed in file names
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
        <div style={{ fontSize: 15, color: colors[index], fontWeight: 800 }}>
          Find and select your name to edit your picks!
        </div>
      </div>
      {/* Start of map */}
      {leaderboardData && (
        <div
          style={{
            width: "90%",
            maxWidth: 500,
            margin: "0 auto",
            background: "var(--section-bg)",
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
                onClick={() => navigate(`/user/${entry.user_id}/${entry.name}`)}
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
                      marginLeft: 12,
                      overflow: "hidden",
                      textWrap: "wrap",
                    }}
                  >
                    <span>{index + 1}.{" "}</span>
                    <span style={{ fontWeight: "500", fontFamily: "Cormorant Garamond, serif", }}>{entry.name.substring(0, 19)}{entry.name.length > 19 ? "..." : ""}</span>
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
                      alt={entry.bestPicture}
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
                <div style={{ display:"flex", justifyContent: "flex-end", alignItems: "center", flex: 1, textAlign: "right", height: "100%" }}>
                  <p style={{ fontFamily: "Cormorant Garamond, serif" , textAlign: "right", marginRight: 6 }}>
                    {entry.totalPoints}
                  </p>
                  <FaChevronRight style={{ opacity: 0.8, color: "rgb(235, 201, 92)", paddingRight: 3, marginBottom: 2  }} />
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
    fontSize: 18,
    borderBottom: "1px solid var(--accent)",
    paddingBottom: 8,
    fontFamily: "Cormorant Garamond, serif",
    color: "white",
    marginBottom: 1,
  },
  row: {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 12,
    backgroundColor: "var(--section-item-bg)",
    padding: "7px 0px",
  },
};

export default Leaderboard;
