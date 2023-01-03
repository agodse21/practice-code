/****search  */
async function main() {
    let search = document.getElementById("search").value;
   let data= await getdata(search);
    append(data);
}

  async function getdata(search) {
    const url = `https://www.omdbapi.com/?apikey=a1d311fe&s=${search}`;

    let res = await fetch(url);
    let data = await res.json();
    console.log(data);
    return data.Search;
  }

  function append(data){
    if(!data){
        return;
    }
    let container=document.getElementById("movie");
    container.style.overflow="scroll" ;
   container.innerHTML="";
    data.forEach(function(ele){
        let img=document.createElement("img");
        img.src=ele.Poster;

        let title=document.createElement("p");
        title.innerText=ele.Title;
        

        let div=document.createElement("div");
        div.setAttribute("class","movie")
        div.addEventListener("click",function(){
          showSearchedMovie(ele);
        })
        
        div.append(img,title);
        container.append(div)
    })
  }
// for set time
let identy;
  function debounce(func,delay){
    if(identy){
        clearTimeout(identy)
    }
    identy = setTimeout(function(){
    func();
},delay)
  }


function showSearchedMovie(ele){
  clearInterval(id)
  let container = document.getElementById("slideshow");
  container.innerHTML="";
  let movie=document.getElementById("movie");
  movie.innerHTML="";
 movie.style.overflow="hidden" ;
  let title=document.createElement("h2");
  title.innerText=`${ele.Title}`;
  // let Type=document.createElement("p")
  // Type.innerText=ele.Type;
  // let Year=document.createElement("p")
  // Year.innerText=ele.Year;
  let rat = document.createElement("p");
  rat.innerHTML = `<p>${ele.Type} | ${ele.Year} | &#x2605 ${getRandomInt(10)}</p>`;  

  let div=document.createElement("div");
  div.setAttribute("class","searchdata")
  let div1=document.createElement("div")


  if(ele.Poster=="N/A"){
    let error=document.createElement("h2")
    error.innerText="Image Not Found";
    error.style.color="red";
   
    div.append( error,div1);
  }else{
    let img=document.createElement("img");
    img.src=ele.Poster;
    div.append(img,div1);
  }
  // Type,Year,
div1.append(title,rat)
  // div.append(img,error,div1);
container.append(div)

function getRandomInt(rat) {
  return Math.floor(Math.random() * rat);
}

}





/*******************slideshow********************** */
let id;
let i = 0;
let imgArr = JSON.parse(localStorage.getItem("slideshow")) || [];
let img_url = [
  "https://img1.hotstarext.com/image/upload/f_auto,t_web_m_1x/sources/r1/cms/prod/7096/1287096-h-b2704fa783bb",
  "https://shifu.hotstarext.com/SOURCE/VOD/cd-2022-06-27/ArielWamaCTP2-c4698b6a-6e0b-45d6-868d-7ab90ab9fc42.jpg",
  "https://img1.hotstarext.com/image/upload/f_auto,t_web_m_1x/sources/r1/cms/prod/9947/1279947-h-d5d3ff34dad1",
  "https://img1.hotstarext.com/image/upload/f_auto,t_web_m_1x/sources/r1/cms/prod/4515/1074515-h-e3467da993bd",
  "https://img1.hotstarext.com/image/upload/f_auto,t_web_m_1x/sources/r1/cms/prod/697/1280697-h-14f7d678dc19",
];

img_url.map(function (elem) {
  imgArr.push(elem);
});
localStorage.setItem("slideshow", JSON.stringify(imgArr));

let imgdata = JSON.parse(localStorage.getItem("slideshow"));
let container = document.getElementById("slideshow");

id = setInterval(function () {
  if (i == imgdata.length) {
    i = 0;
  }
  let img = document.createElement("img");
  img.setAttribute("src", imgdata[i]);
  container.innerHTML = "";
  container.append(img);
  i++;
}, 1500);



function showttrandingmovie(){

  async function getdata() {
    const url = `https://www.omdbapi.com/?apikey=a1d311fe&s=movies`;

    let res = await fetch(url);
    let data = await res.json();
    // console.log(data.Search);
    appendTranding(data.Search)
    //return data.Search;
  }
  getdata()
}
showttrandingmovie();

function appendTranding(data){
  let main=document.getElementById("top_rated_movie")
data.map(function(ele){
  let div=document.createElement("div");
  div.style.backgroundImage=`url(${ele.Poster})`;
  let title=document.createElement("h3");
  title.innerText=ele.Title;

  let text = document.createElement("p");
  text.innerHTML = `<p>${ele.Type} | ${ele.Year} |  </p>`;
  div.append(title,text)
  main.append(div);
})
}

   // div.setAttribute("background-image",`url(${ele.Poster})`)
  // let img=document.createElement("img");
  // img.src=ele.Poster;
  // div.append(img)