// import logo from './logo.svg';
import './App.css';
import React,{useState} from "react"
import { Add} from './components/Add';
import { Reduce } from './components/Reduce';

function App() {
  const [count,setCount]=useState(0);
  const Increment=()=>{
    setCount((prev)=>prev+5)
  }
  const Decrement=()=>{
    setCount((prev)=>prev-5)
  }
  return (
    <div className="App">
      <h2 data-testid="counter-text">Count:{count}</h2>
      <Add onClick={Increment}>Add</Add>
      <Reduce onClick={Decrement}>Reduce</Reduce>
    </div>
  );
}

export default App;
