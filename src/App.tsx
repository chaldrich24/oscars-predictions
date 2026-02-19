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
        return <CreateEntry />;
      default:
        return <Leaderboard />;
    }
  }

  const contentToRender = renderContent();

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          The Oscars 2026
        </h1>
      </header>
      {!content &&<div id="btns">
        <button className='main-btn' onClick={() => setContent("create")}><span style={{marginTop: "5px"}}>CREATE NEW ENTRY</span> <FaPlusCircle className="plus-icon" /></button>
        <button className='main-btn' onClick={() => getLeaderboard()}><span style={{marginTop: "5px"}}>VIEW LEADERBOARD</span> <FaPlusCircle className="plus-icon" /></button>
      </div>}
      {content === "create" && <button className='btn' onClick={() => setContent(null)}>Back</button>}
      {contentToRender}
    </div>
  );
}

export default App;
