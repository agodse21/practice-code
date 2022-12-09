import axios from "axios";

export const GET_TWEETS = "GET_TWEETS";

export const getTweets = () => async (dispatch) => {
  let { data } = await axios.get("http://localhost:3004/posts");
  dispatch({
    type: GET_TWEETS,
    payload: data,
  });
};
