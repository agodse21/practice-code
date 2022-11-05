// js for sign up page

document.querySelector("#btn_signup").value="SIGN UP";
document.querySelector("form").addEventListener("submit",signUp);
let loadno = JSON.parse(localStorage.getItem("mobile_no"))
let infoArr= JSON.parse(localStorage.getItem("userdetails")) || [];
for(let i=0;i<loadno.length;i++){
    document.querySelector("#show_num").innerText=loadno[loadno.length-1].number;
  } 
function signUp(event){
event.preventDefault();
   
  let name=document.querySelector("#name").value;
  let phone=document.querySelector("#phone").value;
let email=document.querySelector("#email").value;
let pass=document.querySelector("#pass").value;
let  checkbox=document.querySelector("#checkbox").value;


if(name=="" || phone ==""|| email=="" ||pass==""){
   document.querySelector("#wrong_disp").innerText="Please Fill All Details"
}else{
   
    let obj={
        "name":name,
        "email":email,
        "mobile":phone,
        "password":pass,
    }
    infoArr.push(obj);
    localStorage.setItem("userdetails",JSON.stringify(infoArr));
    alert("Your Successfully Sign Up");
    window.location.href="login.html";

   
    // let info=JSON.parse(localStorage.getItem("infoArr"));
    // console.log(info)
} 
}
