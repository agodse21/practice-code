import axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getTodoFailure,
  getTodoRequest,
  getTodoSuccess,
} from "../Redux/AppReducer/action";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  CheckIcon,
  EditIcon,
  Icon,
  TimeIcon,
} from "@chakra-ui/icons";

const getTodoApi = (id) => {
  return axios(`http://localhost:8080/todos/${id}`);
};

const updateTodos = (id, status) => {
  return axios.patch(`http://localhost:8080/todos/${id}`, {
    status: status,
  });
};

export default function SingleTodo() {
  const { todos, isError, isLoading } = useSelector((state) => {
    return {
      todos: state.AppReducer.todos,
      isLoading: state.AppReducer.isLoading,
      isError: state.AppReducer.isError,
    };
  }, shallowEqual);
  const dispatch = useDispatch();
  const { id } = useParams();

  const toast = useToast();
  console.log(id);
  useEffect(() => {
    dispatch(getTodoRequest());
    getTodoApi(id)
      .then((r) => {
        // console.log(r.data)
        dispatch(getTodoSuccess(r.data));
      })
      .catch((e) => {
        dispatch(getTodoFailure());
      });
  }, [id]);

  console.log("lets", todos);

  const handleToggle = (id, status) => {
    dispatch(getTodoRequest());
    // console.log(id,status)
    updateTodos(id, status)
      .then((r) => {
        dispatch(getTodoSuccess(r.data));
        console.log(r);
        toast({
            title: `You toggle the status As ${status}`,
            // description: "We've created your account for you.",
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'bottom-right',
          })
      })
      .catch((e) => {
        dispatch(getTodoFailure());
      });
  };
  return (
    <Box w="40%">
      <Center>
        <Heading mt={5} mb={5} size="md">
          Todo Details
        </Heading>
      </Center>

      <Box border="1px solid black" key={todos.id}>
        <Flex alignItems="center" p={5}>
          <Heading size="sm">{todos.title}</Heading>
          <Spacer />
          <Button
            colorScheme={todos.status ? "red" : "green"}
            onClick={() => handleToggle(todos.id, !todos.status)}
          >
            {todos.status ? (
              <Icon as={TimeIcon} />
            ) : (
              <Icon as={CheckCircleIcon} />
            )}
          </Button>
          <Spacer />
          <Link to={`/todo/${todos.id}/edit`}>
            <Button colorScheme="green">
              <Icon as={EditIcon} />
            </Button>
          </Link>
        </Flex>
      </Box>
      <Center><Link to="/"> <Button mt={5} colorScheme='teal' variant='outline'>Go Home</Button></Link></Center>
     
    </Box>
  );
}

// useEffect(() => {

//     GetMedProbyId(id).then(res=>{
//        setMdata(res.data)
//         console.log("ss",res.data)

//     }).catch(err=>{
//         console.log(err)
//     })

//   }, [id]);
