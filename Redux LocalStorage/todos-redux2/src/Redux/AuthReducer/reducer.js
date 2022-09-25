import { accessData, saveData } from "../../utils/LocalStorage";
import * as types from "./actionType";


const intialState={
    isAuth:accessData("isAuth")||false,
    token:"",
    isAuthLoading:false
}

const reducer=(oldState=intialState,action)=>{
    const { type, payload } = action;

    switch (type) {
        case types.USER_LOGIN_REQUEST: {
          return { ...oldState, isAuthLoading: true };
        };
        case types.USER_LOGIN_SUCCESS: {
          saveData("isAuth",true)
            return { ...oldState,isAuth:true,token:payload, isAuthLoading: false };
          }
        default:
            return oldState;
    }


}

export {reducer};