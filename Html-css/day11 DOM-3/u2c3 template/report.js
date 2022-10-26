// write code here, dont change anything in HTML and css files 
// refer to id's mentioned in html files carefully
// Follow the exact column order for tables,for eg: name should be filled under "name" column 
// we are using form here, make sure you are using "submit" eventListener , or else you will get 0 marks

document.querySelector("form").addEventListener("submit",myfunction);
function myfunction(event){
event.preventDefault();
// access value from user
let img =document.querySelector("#image").value;
let name=document.querySelector("#name").value;
let  batch=document.querySelector("#batch").value;
let dsa=document.querySelector("#dsa").value;
let communication=document.querySelector("#cs").value;
let cod=document.querySelector("#coding").value;

// creating element
let tr=document.createElement("tr");
let td1=document.createElement("td");
   let avtar= document.createElement("img");
   avtar.setAttribute("src", img);
   td1.append(avtar);
//    document.querySelector("td").append(x);
let td2=document.createElement("td");
td2.innerText=name;
let td3=document.createElement("td");
td3.innerText=batch;
let td4=document.createElement("td");
td4.innerText=dsa;
let td5=document.createElement("td");
td5.innerText=communication;
let td6=document.createElement("td");
td6.innerText=cod;

let total=Number(dsa)+Number(communication)+Number(cod);
let percentage=(total/30)*100;
let td7=document.createElement("td");
td7.innerText=percentage.toFixed(2);
let td8=document.createElement("td");
if(percentage>50){
    td8.innerText="Regular";
    td8.style.backgroundColor="green"
}else{
    td8.innerText="Async";
    td8.style.backgroundColor="red"
}
let td9=document.createElement("td");
td9.innerText="delete"
td9.style.color="red"
td9.addEventListener("click",deleteitem);
td9.style.cursor="pointer"
function deleteitem(event){
    return this.parentNode.remove();
}

tr.append(td1,td2,td3,td4,td5,td6,td7,td8,td9)
document.querySelector("tbody").append(tr);


}