import * as types from "./actionType";

const initialState = {
  user: [],
  filterData: [],
  isLoading: false,
  isError: false,
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_USER_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case types.GET_USER_DATA_SUCCESS:
      return {
        ...state,
        user: payload,
        filterData: payload,
        isLoading: false,
        isError: false,
      };

    case types.GET_USER_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        user: [],
      };

    case types.PATCH_USER_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        user: [...state.user, payload],
      };

    case types.FILTER_BY_STATE:
      return { ...state, filterData: payload };

    case types.FILTER_BY_YEAR:
      return { ...state, filterData: payload };

    case types.SORT_BY_AGE:
      return { ...state, filterData: payload };

    default:
      return state;
  }
};
