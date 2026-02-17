import { use, useEffect, useState } from 'react';
import './App.css';
import OscarQuestion from './OscarQuestion';
import nominees from "./data/Nominees.json";
import PinInput from './PinInput';

function CreateEntry() {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [pin, setPin] = useState("");

  useEffect(() => {
    setData(nominees);
  }, []);

  useEffect(() => {
    console.log(answers);
    console.log(Object.keys(answers).length);
    console.log(data?.data.length);
  }, [answers]);

  // const setValidPin = (e) => {
  //   const val = e.target.value;
  //   if (val.length > 4) return;
  //   if (!/^\d*$/.test(val)) return;
  //   setPin(val);
  // }

  return (
    <div className='question-wrapper'>
      {data && data.data.map((item) => (
        <OscarQuestion
          key={item.category}
          category={item.category}
          nominees={item.nominees}
          points={item.points}
          answers={answers}
          setAnswers={setAnswers}
        />
      ))}
      {data && <div style={styles.input}>
        <input style={{marginBottom: 12, padding: 12}} type="text" placeholder='Name' maxLength={30} />
        {/* <input style={{marginBottom: 12, padding: 12}} type="number" placeholder='PIN' max={9999} onChange={setValidPin} value={pin} /> */}
        <PinInput pin={pin} setPin={setPin} />
        <button className='submit-btn' onClick={() => console.log("He")}>Submit</button>
      </div>}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 48,
    marginBottom: 48,
  }
}

export default CreateEntry;