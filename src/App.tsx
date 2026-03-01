import "./App.css";
import CreateEntry from "./components/CreateEntry";
import Leaderboard from "./components/Leaderboard";
import UserSelections from "./components/UserSelections";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./styles/theme.css";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <button className="App-header" onClick={() => navigate("/")}>
        <img
          src={"/images/oscars.png"}
          alt="Oscars Logo"
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
