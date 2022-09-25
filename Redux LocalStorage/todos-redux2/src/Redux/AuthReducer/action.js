import * as types from "./actionType";

const UserLoginRequest=()=>{
    return {
        type:types.USER_LOGIN_REQUEST,
    };
};

const UserLoginSuccess=(payload)=>{
    return {
        type:types.USER_LOGIN_SUCCESS,
        payload,
    };
};


const UserLoginFailure=()=>{
    return {
        type:types.USER_LOGIN_FAILURE,
    };
};


export {UserLoginRequest,UserLoginFailure,UserLoginSuccess};