// All the Code for All Students Page Goes Here
let loadval=JSON.parse( localStorage.getItem("admission"))

let acceptArr=JSON.parse(localStorage.getItem("admission-accepted"))||[];
let rejectArr=JSON.parse(localStorage.getItem("admission-rejected"))||[];
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
   let accept=document.createElement("td");
   accept.innerText="Accept";
   accept.style.backgroundColor="green";
   accept.style.color="white";
   accept.style.cursor="pointer";
   accept.addEventListener("click",admissionaccept);
   function admissionaccept(){
    acceptArr.push(ele)
  localStorage.setItem("admission-accepted",JSON.stringify(acceptArr));
  tr.remove();
  loadval.splice(index,1);
  localStorage.setItem("admission", JSON.stringify(loadval));
   }
   let reject=document.createElement("td");
   reject.innerText="Reject";
   reject.style.backgroundColor="red";
   reject.style.color="white";
   reject.style.cursor="pointer";
   reject.addEventListener("click",admissionreject);
   function admissionreject(event,index){
    rejectArr.push(ele);
    localStorage.setItem("admission-rejected",JSON.stringify(rejectArr));
    tr.remove();
loadval.splice(index,1);
localStorage.setItem("admission", JSON.stringify(loadval));
   }


   tr.append(td1,td2,td3,td4,td5,accept,reject);
   document.querySelector("tbody").append(tr);

})
}

displaytable(loadval);

document.querySelector("#filter").addEventListener("change",filteritem);
function filteritem(){
    let selected=document.querySelector("#filter").value;
   if(selected=="all"){  
displaytable(loadval);
   }else{
    let filter=loadval.filter(function(element){
        return element.course==selected;
    })
    displaytable(filter);
   }
   
}