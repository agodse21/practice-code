let btn = document.getElementById("send");
btn.addEventListener("click", payment);

let amoutArr = JSON.parse(localStorage.getItem("amount")) || [];
function payment() {
  let dis = (document.getElementById("display").innerHTML = "");
  let disp = document.getElementById("display");
  let num_div = document.createElement("div");
  num_div.setAttribute("id", "num_div");
  let h2 = document.createElement("h2");
  h2.innerText = "amolgodse@ybl";
  // let history=document.createElement("p");
  // history.innerText="View History"

  let hr = document.createElement("hr");

  let input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("id", "money");
  input.setAttribute("placeholder", "Enter Amount");
  num_div.append(h2);
  let p = document.createElement("p");
  p.setAttribute("id", "debit_p");
  p.innerText = "Debit From";
  let h3 = document.createElement("h2");
  h3.innerText = "HDFC Bank";
  let btn_send = document.createElement("button");
  btn_send.innerText = "SEND";
  btn_send.setAttribute("id", "send_btn");
  btn_send.addEventListener("click", payment_otp);
  let img=document.createElement("img");
  img.setAttribute("id","mid_img");
  img.src="https://cdn-images-1.medium.com/fit/t/1600/480/1*jgKZTyEBiF7BFJYuqpu0Sg.png"

  disp.append(num_div, input, hr, p, h3, btn_send,img);
}

function payment_otp() {
      let intg=document.getElementById("money").value;

  // amoutArr.push(intg)
  // localStorage.setItem("amount",JSON.stringify(amoutArr))

  // console.log(amoutArr);
if(intg==""){
    alert("Please Enter Amount")
    
}else{



  let dis = (document.getElementById("display").innerHTML = "");
  let dsss = document.getElementById("display");
  let h2 = document.createElement("h2");
  h2.innerText = "Enter Your UPI PIN";
  let input = document.createElement("input");
  input.setAttribute("type", "password");
  input.setAttribute("id", "money");
  input.setAttribute("placeholder", "PIN");
  let btn_send = document.createElement("button");
  btn_send.innerText = "SEND";
  btn_send.setAttribute("id", "send_btn");
  btn_send.addEventListener("click", paymentseccess);

  let img=document.createElement("img");
  img.setAttribute("id","mid_img");
  img.src="https://miro.medium.com/max/1400/1*w-wizVCoOO_xSiKgv4hjZQ.gif"

  dsss.append(h2, input, btn_send,img);
}
}

function paymentseccess() {
    let inp = document.getElementById("money").value;

    if(inp==""){
        alert("Please Enter UPI PIN")
    }else{
  let dis = (document.getElementById("display").innerHTML = "");
  
//   let otp = "123";
console.log(inp)
  function bank() {
    if (inp == "123") {
      return true;
    } else {
      return false;
    }
  }

  let payPromise = new Promise(function (resolve, reject) {
    let pin = bank();//123//false

    setTimeout(function () {
      if (pin) {
        let res = resolve("Payment successfull");
      } else {
        reject("Try again later");
      }
    }, 4000);
  });

  let image = document.createElement("img");
  image.setAttribute("id", "payment_success_img");
  image.src = "https://miro.medium.com/max/736/1*E8Ys7gfVryzMjtpYy9Z6gw.gif";
  let di = document.getElementById("display");
  let p = document.createElement("p");
  let p2 = document.createElement("p");
  let p3 = document.createElement("p");
  let p4 = document.createElement("p");
  let imgg=document.createElement("img");
  imgg.setAttribute("id","mid_img")
 
  di.append(image, p,p2,p3,p4,imgg);
  async function cont() {
    try {
      let result = await payPromise;
      image.src =
        "https://fcs3pub.s3.amazonaws.com/photo-book/images/payment/success.gif";
      // console.log(result)
      p.innerText = "Payment of Rs2000 To Amol Succesful!";

      p2.innerText = "Transaction Successfull";;
      p3.innerText = "Transaction id-20ABOL5"
      p4.innerText = "7:20pm on 31 march";
  //     p4.style.backgroundColor = "#5faa46";
  //  p4.style.color = "white";
   imgg.src=" https://cdn-images-1.medium.com/fit/t/1000/300/1*mfRlk35aMOjt981zDlFgrQ.png"
    } catch (err) {
      image.src =
        "https://i0.wp.com/balututorials.com/wp-content/uploads/2020/07/Error.gif";
      p.innerText =
        "Payment of Rs2000 To Amol has failed!";
     
      p2.innerText = "Transaction is failed";
      p2.style.color = "red";
     p3.innerText = "Transaction id-20ABOL84";
      p4.innerText = "7:20pm on 31 march";
     p4.style.backgroundColor = "#ec5644";
     p4.style.color = "white";
     imgg.src="https://cdn-images-1.medium.com/fit/t/1000/300/1*38C8mxc5i-_Ashm9jF8FjA.png"
    }
  }
  cont();
}
}

// let sign=document.getElementById("signup");
// let log=document.getElementById("log")
// log.addEventListener("click",function(){
//   login()
// })
// let signu=document.getElementById("sign")
// signu.addEventListener("click",function(){
//   signup()
// })
// function signup(){
//   sign.innerHTML="";

// let form=document.createElement("form");
// let input=document.createElement("input");
// let h1=document.createElement("h1");
// h1.innerText="signup"
// form.append(input)
// sign.append(form,h1)
// }
// function login(){
//   sign.innerHTML="";

// let form=document.createElement("form");
// let input=document.createElement("input");
// input.setAttribute("id","email")
// let h1=document.createElement("h1");
// h1.innerText="login";
// let btn=document.createElement("button");
// btn.innerText="heeloo";
// btn.addEventListener("click",function(){
//   datasignup()
// })
// form.append(input)
// sign.append(form,h1,btn)
// }


// function datasignup(){
//   let email=document.getElementById("email").value;
//   console.log(email)

// }