let playvid = () => {
    let vid = JSON.parse(localStorage.getItem("youtubevideo"));
    console.log(vid);
    let id = vid.id.videoId;
    let playvid = document.getElementById("playvid");
    playvid.src = `https://www.youtube.com/embed/${id}`;

    let title = document.getElementById("title");
    title.innerText = vid.snippet.title;
    let p = document.getElementById("like");
    p.innerText = `${getRandomInt(1000)}K views`;
    let date=document.getElementById("date");
    date.innerText=vid.snippet.publishTime;
    let description=document.getElementById("description");
    description.innerText=vid.snippet.description;
    let like_no = document.getElementById("like_no");
    like_no.innerText = `${getRandomInt(100)}K `;
    let dislike_no = document.getElementById("dislike_no");
    dislike_no.innerText = `${getRandomInt(100)}`;
  };

  let getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };


  let homedata= async () => {
    let url=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=most%20popular%20video%20in%20India&key=AIzaSyA0RISZLqD6Sj3v5FegUsB1ifDliPdj8gE`; 

    let res=await fetch(url);
    let data= await res.json();
    // console.log("Amol:cj",data.items)
    append(data.items)

}
homedata();

let append= (data)=>{
let section2=document.getElementById("section2");
section2.innerHTML="";
 for(let i=1;i<7;i++){
  let div=document.createElement("div");
  let div2=document.createElement("div");
  // console.log(data[i])

  let image=document.createElement("img");
image.src=data[i].snippet.thumbnails.medium.url;

  let title=document.createElement("h4");
  title.innerText=data[i].snippet.title;

  // console.log(data[i])

  let p=document.createElement("p");
p.innerText=data[i].snippet.channelTitle;  
  div.append(image);
  div2.append(title,p)
  section2.append(div,div2)
 }
}



 
 