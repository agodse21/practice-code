import {  GET_TODOS_FAILURE, GET_TODOS_REQUEST, GET_TODOS_SUCESS, POST_TODOS_FAILURE, POST_TODOS_REQUEST, POST_TODOS_SUCESS} from "./actionType";


const getTodoRequest=()=>{
return {
  type:GET_TODOS_REQUEST
};
}

 const getTodoSuccess=(payload)=>{
  console.log('sinnn',payload)
  return {
    type:GET_TODOS_SUCESS,
    payload
  };
  }


   const getTodoFailure=()=>{
    return {
      type:GET_TODOS_FAILURE
    };
    }



    const posTodoRequest=()=>{
      return {
        type:POST_TODOS_REQUEST
      };
      }
      
       const postTodoSuccess=(payload)=>{
        return {
          type:POST_TODOS_SUCESS,
          payload
        };
        }
      
      
         const postTodoFailure=()=>{
          return {
            type:POST_TODOS_FAILURE
          };
          }
      

export { getTodoFailure,getTodoSuccess,getTodoRequest,posTodoRequest,postTodoFailure,postTodoSuccess };
