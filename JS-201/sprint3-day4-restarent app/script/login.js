import navbar from "../components/navbar.js";

import getUsername from "../components/adminfetch.js";

let nav = document.getElementById("navbar");
nav.innerHTML = navbar();
let userarr = JSON.parse(localStorage.getItem("getusername"));
userarr.map((ele) => {
  let user = document.getElementById("user_show");
  user.innerText = ele.name;
});

let form = document.querySelector("form");
form.addEventListener("submit", login);

let flag = false;

async function login(e) {
  e.preventDefault();

  let loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  loginData = JSON.stringify(loginData);

  let login_api_url = `https://masai-api-mocker.herokuapp.com/auth/login`;

  let response = await fetch(login_api_url, {
    method: "POST",

    body: loginData,

    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();
  console.log(data);
  
  getUsername(username.value, data.token);

  if (data.error === true) {
    alert(data.message);
  } else {
    alert("Sucesssfull!!");
    window.location.reload();
  }
}





 



let adminUname = `amol12`;
  let token = `38f23706dd31346bae3652c8f62382eb`;
  userarr.map((ele) => {
    console.log("xx", ele);

    if (
      ele.username === adminUname &&
      ele.token === token 
    ) {
      // alert("Your Login As Admin");
      let admin = document.getElementById("admin");
      let btn = document.createElement("button");
      btn.innerText = "Admin Section";
      btn.setAttribute("id","admin_btn")
      btn.addEventListener("click", function(){
        toAdminpage();
      });
      admin.append(btn);
    } 
  });
let toAdminpage = () => {
  window.location.href = "admin.html";
};
