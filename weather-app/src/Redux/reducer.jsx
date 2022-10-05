import { accessData, saveData } from "../cookies/cookies";
import * as types from "./actionTypes";
const initState = {
  weatherData: {},
  currentLocation:accessData("city")|| "",
  map: "",
  latitude: "",
  langitude: "",
  error:"",
  forecast:[]
};

export const reducer = (state = initState, action) => {

  const { type, payload } = action;

  switch (type) {
    case types.GET_CURRENT_LOCATION: {
      return {
        ...state,
        currentLocation: payload,
      };
    }
    case types.GET_CURRENT_WEATHER: {
      return {
        ...state,
        weatherData: payload,
      };
    }
    case types.GET_WEATHER_BY_LOCATION: {
        const {data,city}=payload;
        
        saveData("city",city)
      return {
        ...state,
        weatherData: data,currentLocation:city
      };
    }
    case types.GET_WEATHER_FORECAST:{
      return{
        ...state,forecast:payload
      }
    }
    case types.GET_LANGITUDE_OR_LATITUDE: {
        const {langitude,latitude}=payload
      return {
        ...state,
        langitude: langitude,latitude:latitude
      };
    
    }
    case types.GET_ERROR:{
        return {
            ...state,error:payload
        }
    }
    case types.GET_MAP:{
        return {
...state,map:payload
    }}
    default:
         return state 
  }
};
