// import logo from './logo.svg';
import './App.css';
import axios from "axios";
import react,{useEffect,useState} from "react";

function App() {
  const [todos,setTodos]=useState([]);
  const [title,setTitle]=useState([]);
  const [error,setError]=useState('')
  const GetData=()=>{
    axios.get("http://localhost:8080/todos").then((r)=>{
      console.log(r.data);
      setTodos(r.data)
    })
  };
const HandleOnsubmit=(e)=>{
e.preventDefault();
axios.post("http://localhost:8080/todos",{
title:title,
status:false
}).then((r)=>{
  setTodos(r.data);
  GetData()
}).catch((e)=>{
  console.log(e);
  setError(e);
})
}

  useEffect(()=>{
GetData()
  },[])
  return (
    <div className="App">
      <h1>Todos</h1>
      <h2 className='error'>{error}</h2>
      <div className='todo-list'>
      {
      todos.length>0 &&todos.map(item=>
        <h5  key={item.id}>{item.title}</h5>
      )
     }
     </div>
     <form onSubmit={HandleOnsubmit}>
     
      <input className='inputBox' type="text" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <input className='Addbtn' type="submit" value="Add" />
           </form>
    </div>
  );
}

export default App;
