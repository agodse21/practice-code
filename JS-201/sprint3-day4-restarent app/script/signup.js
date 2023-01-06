import navbar from "../components/navbar.js";

let nav = document.getElementById("navbar");
nav.innerHTML = navbar();
let userarr = JSON.parse(localStorage.getItem("getusername"));
userarr.map((ele) => {
  let user = document.getElementById("user_show");
  user.innerText = ele.name;
});
let form = document.querySelector("form");
form.addEventListener("submit", register);
async function register(e) {
  e.preventDefault();
  let signupData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    username: document.getElementById("username").value,
    mobile: document.getElementById("mobile").value,
    description: document.getElementById("desc").value,
  };

  signupData = JSON.stringify(signupData);

  let signup_api_url = `https://masai-api-mocker.herokuapp.com/auth/register`;

  let response = await fetch(signup_api_url, {
    method: "POST",

    body: signupData,

    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();
  console.log(data);
  if (data.error === true) {
    alert(data.message);
  } else {
    alert(data.message);
    window.location.href = "./login.html";
  }
}
