import * as types from "./ActionTypes";

const initialState = {
  pending_task: [],
  doing_task: [],
  done_task: [],
  isLoading: false,
  isError: false,
};

export const reducer = (oldState = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_TASK_REQUEST: {
      return {
        ...oldState,
        isLoading: true,
      };
    }

    case types.GET_PENDING_TASK_SUCCESS: {
      return {
        ...oldState,
        isLoading: false,
        pending_task: payload,
        isError: false,
      };
    }
    case types.GET_DOING_TASK_SUCCESS: {
      return {
        ...oldState,
        isLoading: false,
        doing_task: payload,
        isError: false,
      };
    }
    case types.GET_DONE_TASK_SUCCESS: {
      return {
        ...oldState,
        isLoading: false,
        done_task: payload,
        isError: false,
      };
    }
    case types.GET_TASK_FAILURE: {
      return {
        ...oldState,
        isLoading: false,
        isError: true,
        pending_task: [],
        doing_task: [],
        done_task: [],
      };
    }
    default:
      return oldState;
  }
};
