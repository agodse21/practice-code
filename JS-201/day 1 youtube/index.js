
let q="";
let  search = async () => {
let query=document.getElementById("query").value;

if(query==""){
   document.getElementById("search_icon")=disabled;
}


// alert("yes")
q=query;
let data= await getdata(query)
append(data);


let a=document.getElementById("flll");
let fltr_btn=document.createElement("button");
fltr_btn.innerText="Filter by Channel ID";
fltr_btn.setAttribute("id","filter")
fltr_btn.addEventListener("click",function(){
    filter(data);
})
a.append(fltr_btn);


}

let getdata= async (query) => {
let url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&key=AIzaSyA0RISZLqD6Sj3v5FegUsB1ifDliPdj8gE`; 

let res=await fetch(url);
let data= await res.json();
console.log(data.items)

return data.items;
};

 let append=(data) => {
  let container=document.getElementById("container");
  container.innerHTML="";

data.forEach((ele) =>{

let image=document.createElement("img");
image.src=ele.snippet.thumbnails.medium.url;

let h3=document.createElement("h4");
h3.innerText=ele.snippet.title;
let p=document.createElement("p");
p.innerText=ele.snippet.channelTitle;  

let div=document.createElement("div");
div.setAttribute("class","video");
div.onclick= ()=>{
    saveVideo(ele);
}
// div.addEventListener("click",function(){
   
// })

div.append(image,h3,p);

container.append( div);

})




 }
// let vidArr= JSON.parse(localStorage.getItem("youtubevideo"))||[];


let filter = async (data) => {
    alert("Filter Data By channel Id=UCvC4D8onUfXzvjTOM-dBfEA ")
    // let data = await getdata(q);
    
   let res = data.filter((el) => {
      return el.snippet.channelId === "UCvI5azOD4eDumpshr00EfIw";
    });
    console.log("xxxx",res);
    append(res);
  };

 let  saveVideo=(data)=>{
    localStorage.setItem("youtubevideo",JSON.stringify(data));

    window.location.href="video.html";
 }



/*data.forEach(({snippet:{title, thumbnails:{medium:{url}}}}) =>{
//snippet>>title ,thumblius>meddium>url,
let image=document.createElement("img");
image.src=url;


let h3=document.createElement("h3");
h3.innerText=title;

let div=document.createElement("div");
div.setAttribute("class","video");
div.onclick= ()=>{
    saveVideo({snippet:{title, thumbnails:{medium:{url}}}}));
} */


let homedata= async () => {
    let url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=most%20popular%20video%20in%20India&key=AIzaSyA0RISZLqD6Sj3v5FegUsB1ifDliPdj8gE`; 

    // let fltr_btn=document.getElementById("flll");
    // fltr_btn.innerHTML="";

    let res=await fetch(url);
    let data= await res.json();
    console.log("Amol:",data.items)
    append(data.items)



}






// let getdata= async (query) => {
// let url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&key=AIzaSyBSOL0jXcHRcAqG2RqeKrP6KnbSVmydgn4`; 

// let res=await fetch(url);
// let data= await res.json();
// console.log(data.items)

// return data.items;
// };