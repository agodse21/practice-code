let signupbtn=document.getElementById("signup_btn");
signupbtn.value="Sign Up";
let form=document.querySelector("form");
form.addEventListener("submit",submitDetails);
let userArr=JSON.parse(localStorage.getItem("signupData"))||[];

function submitDetails(eve){
    eve.preventDefault();
    let name=form.name.value;
    let mobile=form.mobile.value;
    let email=form.email.value;
    let pass=form.password.value;

if(name=="" || mobile=="" || email=="" || pass==""){
    alert("Please Fill All details")
}else{
    let user=new userconst(name,mobile,email,pass);
    userArr.push(user);
    // console.log(userArr)
    localStorage.setItem("signupData",JSON.stringify(userArr));
   alert("Sign Up Successful!!")
   form.name.value ="";
   form.mobile.value="";
   form.email.value="";
   form.password.value="";
}


    
  
}

function userconst(n,m,e,p){
    this.name=n;
    this.mobile=m;
    this.email=e;
    this.password=p;
}