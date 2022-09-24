import React, { useState } from 'react'
import { Button } from './Button'
import { Header } from './Header'

export const Counter = () => {
    const [count,setCount]=useState<number>(0);
    const HandleClick=(val:number)=>{
setCount(count+val);
    }
  return (
    <div style={{border:"3px solid black",margin:"auto",width:"30%",marginTop:"30px",padding:"10px",borderRadius:"10px"}}>
        <Header label="Counter" />
        <Header label={`${count}`} />
        <div style={{display:"flex",justifyContent:"space-evenly",margin:"auto",width:"50%"}}><Button  label="Add" HandleClick={()=>HandleClick(1)} />
<Button label="Reduce"  HandleClick={()=>HandleClick(-1)} />
</div>

    </div>
  )
}
