import logo from './logo.svg';
import './App.css';
import react, { useEffect } from 'react'
import axios from "axios"
const api=(post)=>{
  return axios.post("http://localhost:8000",post)
}
function App() {
 useEffect(()=>{
  api({
    id:20,
    title:"amol",
    status:false
  }).then((r)=>{
    console.log(r)
  })
// fetch("http://localhost:8000")
//     .then(response => response.json())
//     .then(data => console.log(data));

 },[])
   return(
     <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
