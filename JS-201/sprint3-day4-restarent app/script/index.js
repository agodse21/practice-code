import navbar from "../components/navbar.js";


let nav=document.getElementById("navbar");
nav.innerHTML=navbar();

// import getUsername from "../components/adminfetch.js";



let userarr = JSON.parse(localStorage.getItem("getusername"));
userarr.map((ele) => {
  let user = document.getElementById("user_show");
  user.innerText = ele.name;
});