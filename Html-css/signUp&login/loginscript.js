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
        alert("please sign up first")
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
        alert("Sign In Successfully").break;
        
          
       }else{
        alert("Please Check You Entered Details").break;
        
       }
    });

}
   

}