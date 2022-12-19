let loginbtn=document.getElementById("login_btn");
loginbtn.value="login";

let form=document.querySelector("form");
form.addEventListener("submit",checkLogDetails);
let userArr=JSON.parse(localStorage.getItem("signupData"));
let logArr=JSON.parse(localStorage.getItem("loginData"))||[];


function checkLogDetails(eve){
    eve.preventDefault();
    let email=form.email.value;
    let pass=form.password.value;
    if(email=="" || pass==""){
        alert("Please Fill All details")
   }else{
    userArr.map(function(elem){
        
            if((email==elem.email) && (pass==elem.password)){
              
               let log=new logcons(email,pass);
               logArr.push(log);
               localStorage.setItem("loginData",JSON.stringify(logArr))
               window.location.href="index.html";
               alert("Log in Sucessful!!").break;
               function logcons(email,pass){
                this.email=email;
                this.password=pass;
            }            
            
            }else{
              return alert("Invalid Credentials").break;
              
            }   
        }) 
        }

     
}
