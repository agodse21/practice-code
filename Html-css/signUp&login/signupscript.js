

 const signUpValue=document.querySelector("#btn").value="SIGN UP";

document.querySelector("form").addEventListener("submit", myfun);
let infoArr= JSON.parse(localStorage.getItem("details")) || [];
function myfun(event){
     event.preventDefault();
   
  let name=document.querySelector("#name").value;
let email=document.querySelector("#email").value;
let pass=document.querySelector("#pass").value;

if(name=="" || email=="" ||pass==""){
    alert("Please Enetr All Details")
}else{
   
    let obj={
        "name":name,
        "email":email,
        "password":pass,
    }
    infoArr.push(obj);
    localStorage.setItem("details",JSON.stringify(infoArr));
    alert("Your Successfully Sign Up");
    window.location.href="login.html";

   
    // let info=JSON.parse(localStorage.getItem("infoArr"));
    // console.log(info)
} 
}

