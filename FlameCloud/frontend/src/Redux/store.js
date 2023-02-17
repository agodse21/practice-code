import { legacy_createStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import thunk from "redux-thunk";

const store = legacy_createStore(reducer, applyMiddleware(thunk));

export { store };
