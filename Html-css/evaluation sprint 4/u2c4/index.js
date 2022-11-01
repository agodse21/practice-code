// All the JS Code for the Add Students Page Goes Here

document.querySelector("form"),addEventListener("submit",storedata)
let dataArr=JSON.parse(localStorage.getItem("admission"))||[];
function storedata(event){
event.preventDefault();
let name=document.getElementById("name").value;
let email=document.getElementById("email").value;
let phone=document.getElementById("phone").value;
let gender=document.getElementById("gender").value;
let course=document.getElementById("course").value;
let obj={
    "name":name,
    "email":email,
    "phone":phone,
    "gender":gender,
    "course":course

}
dataArr.push(obj);
localStorage.setItem("admission", JSON.stringify(dataArr));
document.getElementById("name").value="";
document.getElementById("email").value="";
document.getElementById("phone").value="";
}
