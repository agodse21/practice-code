import { Box } from "@mui/system";
import {react} from "react";
import "./app.css";
import {BrowserRouter} from "react-router-dom"
import { AllRoutes } from "./Routes/AllRoutes";

function App() {
  return (
    <Box> <Box>
      <AllRoutes />   </Box>
    </Box>
  );
}

export default App;
