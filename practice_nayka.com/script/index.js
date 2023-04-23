let sign_btn = document.getElementById("sign_btn");
sign_btn.addEventListener("click", function () {
  window.location.href = "./login.html";
});
document.getElementById("bag").addEventListener("click", function () {
  window.location.href = "./cart.html";
});
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "./index.html";
});

let Namearr = JSON.parse(localStorage.getItem("signUpData"));
Namearr.map(function (ele) {
  document.getElementById("sign_btn").disabled = true;
  document.getElementById("sign_btn").innerText = ele.name;
});
