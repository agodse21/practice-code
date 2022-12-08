import * as types from "./actionType";

const initialState = {
  token: "",
  isAuth: false,
  isLoading: false,
  isError: false,
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.USER_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.USER_LOGIN_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuth: true,
        isLoading: false,
        isError: false,
      };

    case types.USER_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        token: "",
        isAuth: false,
      };

    default:
      return state;
  }
};
