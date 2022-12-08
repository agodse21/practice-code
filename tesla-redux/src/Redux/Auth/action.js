import * as types from "./actionType";
import axios from "axios";

export const loginData = (payload) => (dispatch) => {
  dispatch({ type: types.USER_LOGIN_REQUEST });

  return axios
    .post("https://reqres.in/api/login", payload)
    .then((res) => {
      console.log(res.data.token);
      dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data.token });
      return { type: types.USER_LOGIN_SUCCESS };
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.USER_LOGIN_FAILURE, payload: err });
    });
};
