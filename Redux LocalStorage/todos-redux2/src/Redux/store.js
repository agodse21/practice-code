import { combineReducers, legacy_createStore } from "redux";
import { reducer as AppReducer } from "./AppReducer/reducer";
import {reducer as AuthRedcer} from "./AuthReducer/reducer"
 const rootReducer=combineReducers({AppReducer,AuthRedcer})
const store=legacy_createStore(rootReducer)
    
    // window.__REDUX_DEVTOOLS_EXTENSION_ || window.__REDUX_DEVTOOLS_EXTENSION__())


export default store;