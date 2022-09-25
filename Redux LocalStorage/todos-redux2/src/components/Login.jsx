import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  UserLoginFailure,
  UserLoginRequest,
  UserLoginSuccess,
} from "../Redux/AuthReducer/action";

const inital = {
  email: "",
  password: "",
};
function LoginPage() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(inital);

  console.log(user);
  const HandleOnchange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleLogin = () => {
    if (user) {
      const payload = user;
      dispatch(UserLoginRequest());
      return axios
        .post(`https://reqres.in/api/login`, payload)
        .then((r) => {
          dispatch(UserLoginSuccess(r.data.token));
        })
        .catch((e) => {
          dispatch(UserLoginFailure(e));
        });
    }
  };
  return (
    <>
      <Box mt={5}>
        <Heading>Login page</Heading>
        <Box mt={5}>
          <Stack>
            <Input
              name="email"
              value={user.email}
              onChange={HandleOnchange}
              placeholder="email"
            />
            <Input
              name="password"
              value={user.password}
              onChange={HandleOnchange}
              placeholder="password"
            />
            <Button onClick={handleLogin} colorScheme="teal">
              login
            </Button>
          </Stack>
        </Box>
        <Center><Link to="/"> <Button mt={5} colorScheme='teal' variant='outline'>Go Home</Button></Link></Center>
 
      </Box>
         </>
  );
}
export default LoginPage;
