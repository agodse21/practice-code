import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Todo } from './components/Todo';
import {Box } from "@chakra-ui/react"
function App() {
  return (
    <Box  className="App">
     <Todo />
    </Box>
  );
}

export default App;
