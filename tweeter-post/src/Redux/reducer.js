import { GET_TWEETS } from "./action";

const initState = {
  users: [],
  posts: [],
  current: {
    user: "John",
  },
  isLoggedIn: true,
};

export const Reducer = (state = initState, { type, payload }) => {
  switch (type) {
    case GET_TWEETS:
      return { ...state, posts: payload };
    default:
      return state;
  }
};
