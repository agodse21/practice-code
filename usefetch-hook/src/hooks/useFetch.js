import {useEffect, useState} from "react"
import axios from "axios"
export const useFetch = () => {
 const [data,setData]=useState([]);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState(false);

 const FetchData=()=>{
    setLoading(true)
    axios.get(`http://api.github.com/users?q=Masai`).then(r=>{
        setLoading(false);
        setData(r.data);
    }).catch(e=>{
        setError(true);
        setLoading(false)
    })
 }
 useEffect(()=>{
    FetchData()
},[])
return{ data,loading,error}
}

export default useFetch;

