import "./App.css";
import { useState } from "react";
import Cam from "./cam";

function App() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="App">
      <input placeholder="name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="pass" onChange={(e) => setPass(e.target.value)} />
      <br />
      <button className={name == "" || pass == "" ? "oky" : "ohky"}>
        submit
      </button>
      <Cam />
    </div>
  );
}

export default App;
