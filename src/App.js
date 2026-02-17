import { useState } from 'react';
import './App.css';
import CreateEntry from './CreateEntry';



function App() {
  const [content, setContent] = useState();

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          The Oscars 2026
        </h1>
      </header>
      {!content &&<div id="btns">
        <button className='main-btn' onClick={() => setContent("create")}>Add Entry</button>
        <button className='main-btn' onClick={() => console.log("He")}>Edit Entry</button>
      </div>}
      {content && <button className='btn' onClick={() => setContent(null)}>Back</button>}
      {content === "create" && <CreateEntry />}
    </div>
  );
}

export default App;
