import React from 'react'
import useFetch from '../hooks/useFetch';

export const GithubUsers = () => {
 
const {data,loading,error}=useFetch();

return (
  <div className="App">
   
<h1>{loading &&"loading"}</h1>
<div>
{data.length>0 && data.map((item,index)=>{
  return <div key={index}>{item.login}</div>
})}
</div>

  </div>
);

}
