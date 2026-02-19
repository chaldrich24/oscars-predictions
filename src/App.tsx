import { useState } from 'react';
import './App.css';
import CreateEntry from './components/CreateEntry';
import { FaPlusCircle } from "react-icons/fa";
import Leaderboard from './components/Leaderboard';
import { getLeaderboard } from './lib/supabaseClient';

function App() {
  const [content, setContent] = useState<string | null>(null);

  const renderContent = () => {
    switch (content) {
      case "create":
        return <CreateEntry setContent={setContent} />;
      case "leaderboard":
        return <Leaderboard />;
    }
  }

  const contentToRender = renderContent();

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={"/images/oscars.png"}
          style={{ display: "block", width: "100%", height: 100, objectFit: "contain", paddingLeft: 20 }}
        />
      </header>
      {!content &&<div id="btns">
        <button className='main-btn' onClick={() => setContent("create")}><span style={{marginTop: "5px"}}>CREATE NEW ENTRY</span> <FaPlusCircle className="plus-icon" /></button>
        <button className='main-btn' onClick={() => setContent("leaderboard")}><span style={{marginTop: "5px"}}>VIEW LEADERBOARD</span> <FaPlusCircle className="plus-icon" /></button>
      </div>}
      {content && <button className='btn' onClick={() => setContent(null)}>Back</button>}
      {contentToRender}
    </div>
  );
}

export default App;
