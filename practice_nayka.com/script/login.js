let close_btn = document.getElementById("close");
close_btn.addEventListener("click", function () {
  window.location.href = "./index.html";
});

let Email = document.getElementById("Email");
let login_text = document.getElementById("login_text");
let main = document.getElementById("main");
let proceedBtn = document.querySelector(".submit-btn");
let signUpData = JSON.parse(localStorage.getItem("signUpData")) || [];
proceedBtn.addEventListener("click", function () {
  login_text.innerHTML = "";
  if (Email.value == "") {
    alert("Please Enter Mobile number or Email");
  } else {
    let p = document.createElement("p");
    p.textContent =
      "Welcome back Nykaa user,Please enter the OTP sent on your phone(Be sure to check your spam folder)";
    let otp = document.createElement("input");
    otp.setAttribute("type", "number");

    otp.setAttribute("placeholder", "OTP");
    otp.setAttribute("id", "OTP");
    proceedBtn.textContent = "VERIFY";
    proceedBtn.addEventListener("click", function () {
      if (otp.value === "1234") {
        let tempData = signUpData?.filter((ele) => {
          return ele.email == Email.value || ele.mobile == Email.value;
        });

        if (tempData?.length > 0) {
          alert("Login Successfull!");
          window.location.href = "./index.html";
        } else {
          main.innerHTML = "";
          let div = document.createElement("div");
          div.setAttribute("id", "close_div");
          let Cls = document.createElement("h2");
          Cls.setAttribute("id", "close");
          Cls.textContent = "X";
          let text = document.createElement("h2");
          text.setAttribute("id", "loginText");
          text.textContent = "ALMOST THERE!";
          div.append(Cls, text);
          let hr = document.createElement("hr");
          let inputBox = document.createElement("div");
          let name = document.createElement("input");
          name.setAttribute("class", "emailAndPass");
          name.setAttribute("type", "text");
          name.setAttribute("placeholder", "Full Name");
          let mail = document.createElement("input");
          mail.setAttribute("class", "emailAndPass");
          mail.setAttribute("type", "email");
          mail.setAttribute("placeholder", "Email Address");
          let mobile = document.createElement("input");
          mobile.setAttribute("class", "emailAndPass");
          mobile.setAttribute("type", "number");
          mobile.setAttribute("placeholder", "Your Mobile number");
          inputBox.append(name, mail, mobile);
          let save_btn = document.createElement("button");
          save_btn.setAttribute("class", "submit-btn");
          save_btn.textContent = "SAVE";
          save_btn.addEventListener("click", function () {
            if (name.value == "" || mail.value == "" || mobile.value == "") {
              alert("please Enter All Details");
            } else {
              let payload = {
                name: name.value,
                email: mail.value,
                mobile: mobile.value,
              };
              signUpData.push(payload);
              localStorage.setItem("signUpData", JSON.stringify(signUpData));
              alert("Account Created!");
              window.location.href = "./index.html";
            }
          });
          main.append(div, hr, inputBox, save_btn);
        }
      } else {
        alert("Please enter valid OTP");
      }
    });
    login_text.append(p, otp);
  }
});

let Namearr = JSON.parse(localStorage.getItem("signUpData"));
Namearr.map(function (ele) {
  document.getElementById("sign_btn").disabled = true;
  document.getElementById("sign_btn").innerText = ele.name;
});
