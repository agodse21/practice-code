document.querySelector("form").addEventListener("submit",mydata);
function mydata(event){
    event.preventDefault();
let que=document.querySelector("#title").value;
let link=document.querySelector("#link").value;
let diff=document.querySelector("#difficulty").value;

let tr=document.createElement("tr");

let td1=document.createElement("td");
td1.innerText=que;

let td2=document.createElement("td");
td2.innerText=link;

let td3=document.createElement("td");
td3.innerText=diff;

let td4=document.createElement("td");
if(diff=="Medium" || diff=="Hard"){
    td4.innerText="Yes";
}else if(diff=="Easy"){
    td4.innerText="No";
}

let del=document.createElement("td");
del.innerText="DELETE";
del.style.color="red";
del.style.cursor="pointer"
del.addEventListener("click",delfun);
function delfun(event){
    tr.remove();
}
tr.append(td1,td2,td3,td4,del);
document.querySelector("tbody").append(tr)
localStorage.setItem("Question title",que);
localStorage.setItem("OJ link",link);
localStorage.setItem("Difficulty level",diff);
localStorage.setItem("rev",td4.innerText);




}