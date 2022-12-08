// function ValidateEmail(inputText) {
//   var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   if (inputText.value.match(mailformat)) {
//     alert("Valid email address!");
//     document.form1.text1.focus();
//     return true;
//   } else {
//     alert("You have entered an invalid email address!");
//     document.form1.text1.focus();
//     return false;
//   }
// }

let form = document.querySelector("form");
form.addEventListener("submit", HandleForm);
function HandleForm(e) {
  e.preventDefault();
  var firstPart = /^([a-zA-Z0-9\.-@]+)$/;
  var alp = "@";
  var dot = ".";
  var secondPart = /^([a-zA-Z0-9-]+)$/;
  var last = /^([a-z]{2,8})$/;
  var ext = /^(.[a-z]{2,8})?$/;
  let val = form.text1.value;

  if (val.match(firstPart)) {
    if (val.indexOf("@") <= 0) {
      return alert("No character before @");
    } else {
      if (val.indexOf(".") <= 0) {
        return alert("No character before dot");
      }else if(val.test(ext)){
       alert("done")
      }else{
        alert("not")
      }
    }
  } else {
    alert("Please check content");
  }
}

// if (val.match("@")) {
//   for (let i = 0; i < val.length; i++) {
//     if (val[0] == ".") {
//       return alert("can not start with dot .");
//     } else if (val[0] == "@") {
//       return alert("No character before @");
//     } else if (val.match(ext)) {
//       return alert("don");
//     }
// else {
//   return alert(
//     `${val[val.length - 2]} ${val[val.length - 1]} Not valid`
//   );
// }
//   }
// } else {
//   alert("@ is not present");
// }
// if (val.match("@")) {

//   for (let i = 0; i < val.length; i++) {
//     if (val[0] == ".") {
//       return alert("can not start with dot .");
//     } else if(val[0]=="@") {
//      return alert("No character before @");
//     }else if(val[i]=="."){

//           // return
//           alert("something")

//     }else{
//       return alert("done")
//     }
//   }
// } else {
//   alert("@ is not present");
// }
