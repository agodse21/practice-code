let form=document.querySelector("form");
form.addEventListener("submit",submitStudData);

let studData=JSON.parse(localStorage.getItem("StudentData"))||[];

function submitStudData(ev){
ev.preventDefault();

let name=form.name.value;
let course=form.course.value;
let unit=form.unit.value;
let image=form.image.value;
let batch=form.batch.value;
let stud1=new studCustroctor(name, course, unit, image , batch);
studData.push(stud1)
localStorage.setItem("StudentData",JSON.stringify(studData));
alert("data Added")
window.location.reload();

// console.log(studData)
}

function studCustroctor(n,c,u,i,b){
this.name=n;
this.course=c;
this.unit=u;
this.image=i;
this.batch=`FW-WEB:-${b}`;
}
// let studbatch=JSON.parse(localStorage.getItem("Studentbatch"))||[];
function studcalculate(studData){
    let obj={};
  let arr=[]
    for(let i=0;i<studData.length;i++){
if(!obj[studData[i].batch]){
    obj[studData[i].batch]=0;
}
    }

    for(let i=0;i<studData.length;i++){
        
            obj[studData[i].batch]++;
          }
          return obj;
        }

let x=studcalculate(studData);

for(let key in x){
    let nav=document.getElementById("nav");
let div=document.createElement("div");
let p=document.createElement("p");
let hr=document.createElement("hr");
    p.innerText=key+" - "+ x[key];
    console.log(key+" - "+ x[key])
    
    div.append(p);
    nav.append(div,hr)
}

