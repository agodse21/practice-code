document.querySelector("#btn").value="SIGN IN";

document.querySelector("#forgetpass").addEventListener("click", forgotpass);
    function forgotpass(){
        alert("The feature will be Available soon")
    }
document.querySelector("form").addEventListener("submit", login);
var loadVal = JSON.parse(localStorage.getItem('details'))



 let infoArr= JSON.parse(localStorage.getItem("logdetails")) || [];
function login(event){
    event.preventDefault();
    let email=document.querySelector("#email").value;
    let pass=document.querySelector("#pass").value;
    
    if(loadVal==null){
        alert("Your New on my Site ,Please Sign Up Pirst")
        window.location.href="signup.html";
    }else {

    
    loadVal.map(function(elem){

      
       if((email==elem.email)&&(pass==elem.password)){
        
        
        
          let obj={
            "email":email,
            "password":pass,
        }
        infoArr.push(obj);
        localStorage.setItem("logdetails",JSON.stringify(infoArr));
        alert("Sign In Successfully,Enjoy Your Shopping")
        window.location.href="navbar.html";
          
       }else{
        alert("Please Check Your Details").break;
        
       }
    });

}
   

}