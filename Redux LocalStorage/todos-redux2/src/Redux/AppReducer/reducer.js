// import { Add, Reduce } from "./actionType";
import * as types from "./actionType";
import {accessData, saveData } from "../../utils/LocalStorage"
const intialState = {
  todos:accessData("todos") || [],
  isLoading: false,
  isError: false,
};
const reducer = (oldState = intialState, action) => {
  const { type, payload } = action;
 
  switch (type) {
    case types.GET_TODOS_REQUEST: {
      return { ...oldState, isLoading: true };
    }
    case types.GET_TODOS_SUCESS: {
      // let tempTodos=oldState.todos+payload>=100?100:oldState.count+payload;
      saveData("todos",payload)
      // return { ...oldState, count: tempcount };
      return { ...oldState, isLoading: false, todos: payload };
    }
    case types.GET_TODOS_FAILURE: {
      return { ...oldState, isLoading: false, todos: [], isError: true };
    }

    default:
      return oldState;
  }
};
export { reducer };
