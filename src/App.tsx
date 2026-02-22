import { useMemo, useState, useEffect, useRef } from "react";
import "./App.css";
import CreateEntry from "./components/CreateEntry";
import { FaPlusCircle } from "react-icons/fa";
import Leaderboard from "./components/Leaderboard";
import { getLeaderboard } from "./lib/supabaseClient";
import UserSelections, { UserSelectionsObj } from "./components/UserSelections";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <button className="App-header" onClick={() => navigate("/")}>
        <img
          src={"/images/oscars.png"}
          style={{
            display: "block",
            width: "100%",
            height: 100,
            objectFit: "contain",
            paddingLeft: 20,
          }}
        />
      </button>
      <Routes>
        <Route path="/create-new-entry" element={<CreateEntry />} />
        <Route path="/" element={<Leaderboard />} />
        <Route path="/user/:userId/:name" element={<UserSelections />} />
      </Routes>
    </div>
  );
}

export default App;
