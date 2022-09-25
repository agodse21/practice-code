
import './App.css';
import { Todos } from './components/Todos';
import AllRouter from './Routers/AllRouter';
import {Box, Button, Center, Flex, Heading, Icon, Spacer, useColorMode} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons"
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isAuth=useSelector(state=>state.AuthRedcer.isAuth);
  // const isAuth=useSelector((state)=>{
  //   return state.AuthRedcer.state;
  // })
  console.log("home",isAuth)

  const HandleLogout=()=>{
    localStorage.removeItem("isAuth");
    window.location.reload()
  }
  return (
     <Box>
      <Box bg="blue" p={5}>
        <Flex >
          <Link to="/">
        <Heading  color="yellow">MY TODOS</Heading></Link>   <Spacer />
        {isAuth&& <Button onClick={HandleLogout} mr={5}>Log out</Button>}
       
        <Button onClick={toggleColorMode}>
         {colorMode === "light" ? <Icon as={MoonIcon} /> :<Icon as={SunIcon
        } />}
      </Button>
      </Flex>
      </Box>
      <Center>
      <AllRouter />
      </Center>
      </Box>
      
  );
}

export default App;
