// All the Code for the Rejected page goes here
let loadRejectedAdd=JSON.parse(localStorage.getItem("admission-rejected"));


function displaytable(data){
    let tb=document.querySelector("tbody");
   tb.innerHTML="";
data.forEach(function(ele,index){
   
   let tr=document.createElement("tr");
   let td1=document.createElement("td");
   td1.innerText=ele.name;
   let td2=document.createElement("td");
   td2.innerText=ele.email;
   let td3=document.createElement("td");
   td3.innerText=ele.course;
   let td4=document.createElement("td");
   td4.innerText=ele.gender;
   let td5=document.createElement("td");
 td5.innerText=ele.phone;
  
   tr.append(td1,td2,td3,td4,td5);
   document.querySelector("tbody").append(tr);

})
}
displaytable(loadRejectedAdd)


