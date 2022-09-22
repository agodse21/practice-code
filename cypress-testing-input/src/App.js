// import logo from './logo.svg';
import './App.css';
import react, {useEffect,useRef,useState} from "react"

const intialValue={
  val:"masai"
}
function App() {
  const inputElement=useRef();
  const [val,setVal]=useState("");

  const InputFocus=()=>{
    inputElement.current.focus();
  }
  useEffect(()=>{
InputFocus()
  },[]);
  console.log(val)
  if(intialValue.val===val){
    console.log("the value should have be the same as the typed value")
  }
  return (
    <div className="App">
<input className='inputbox' value={val} onChange={(e)=>setVal(e.target.value)} type="text"  ref={inputElement} />
      
          </div>
  );
}

export default App;
