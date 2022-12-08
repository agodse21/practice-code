import * as types from "./actionType";
import axios from "axios";

export const userData = (payload) => (dispatch) => {
  dispatch({ type: types.GET_USER_DATA_REQUEST });
  return axios
    .get("https://tp-3uty.onrender.com/user", payload)
    .then((res) => {
      //   console.log(res.data);
      dispatch({ type: types.GET_USER_DATA_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.GET_USER_DATA_FAILURE, payload: err });
    });
};

export const userPost = (payload) => (dispatch) => {
  dispatch({ type: types.POST_USER_DATA_REQUEST });
  return axios
    .post("https://tp-3uty.onrender.com/user", payload)
    .then((res) => {
      // console.log(res.data);
      dispatch({ type: types.POST_USER_DATA_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.POST_USER_DATA_FAILURE, payload: err });
    });
};

export const userDelete = (payload) => (dispatch) => {
  return axios
    .delete(`https://tp-3uty.onrender.com/user/${payload}`)
    .then((res) => {
      dispatch({ type: types.DELETE_USER_DATA });
      dispatch(userData());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const userEdit = (payload) => (dispatch) => {
  const { id, data } = payload;
  // console.log(id, data);
  dispatch({ type: types.PATCH_USER_DATA_REQUEST });
  return axios
    .patch(`https://tp-3uty.onrender.com/user/${id}`, data)
    .then((res) => {
      dispatch({ type: types.PATCH_USER_DATA_SUCCESS, payload: res.data });
      dispatch(userData());
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.PATCH_USER_DATA_FAILURE, payload: err });
    });
};

export const filterByState = (data) => {
  return {
    type: types.FILTER_BY_STATE,
    payload: data,
  };
};

export const filterByYear = (data) => {
  return {
    type: types.FILTER_BY_YEAR,
    payload: data,
  };
};

export const sortByAge = (data) => {
  return {
    type: types.SORT_BY_AGE,
    payload: data,
  };
};
