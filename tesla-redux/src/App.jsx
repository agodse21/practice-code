import { useState } from "react";
import { AllRoutes } from "./Routes/AllRoutes";

// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <AllRoutes />
    </div>
  );
}

export default App;
