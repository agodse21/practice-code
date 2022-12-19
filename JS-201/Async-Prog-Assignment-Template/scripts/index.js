let id;
    let i=0;
    let  imgArr=JSON.parse(localStorage.getItem("slideshow"))||[];
let img_url=["https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fG1vdmllfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
"https://images.unsplash.com/photo-1543536448-d209d2d13a1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vdmllfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=500&q=60","https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8bW92aWV8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60","https://media.istockphoto.com/photos/asian-chinese-grandfather-and-granddaughter-together-with-group-of-picture-id1335045906?b=1&k=20&m=1335045906&s=170667a&w=0&h=fk5FNeTxdqVOYCgY7ag-klpRFaIvI4CNlCWRGiT68ZA="
]


img_url.map(function(elem){
    imgArr.push(elem)
   
})
localStorage.setItem("slideshow",JSON.stringify(imgArr)); 






    let imgdata=JSON.parse(localStorage.getItem("slideshow"));
let container=document.getElementById("slideshow");

id =setInterval(function(){
if(i==imgdata.length){
    i=0;
}
let img=document.createElement("img");
img.setAttribute("src",imgdata[i])
container.innerHTML="";
container.append(img);
i++;
},1500)

let moviesArr=JSON.parse(localStorage.getItem("movies"))||[];
// {name:"The Shawshank Redemption", release_date:"14 October 1994",poster:"https://m.media-amazon.com/images/I/519NBNHX5BL._SY445_.jpg",IMDb_rat:"9.3"},

let fav_movies=[
{name:"The Godfather",release_date:"14 March 1972",poster:"https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",IMDb_rat:9},
{name:"The Dark Knight",release_date:"18 July 2008",poster:"https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",IMDb_rat:9.0},
{name:"Pushpa",release_date:"17 Dec, 2021",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa--the-rise-et00129538-08-12-2021-01-21-46.jpg",IMDb_rat:7.6},
{name:"JugJugg Jeeyo",release_date:"24 Jun, 2022",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/jugjugg-jeeyo-et00318143-18-05-2022-08-27-03.jpg",IMDb_rat:6.5},
{name:"777 Charlie",release_date:"10 Jun, 2022",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/777-charlie-et00077150-31-05-2022-11-46-42.jpg",IMDb_rat:8.0},
{name:"MAJOR",release_date:"3 Jun, 2022",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/major-et00097589-27-05-2022-08-31-06.jpg",IMDb_rat:9.6},
{name:"Janhit Mein Jaari",release_date:"10 Jun, 2022",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/janhit-mein-jaari-et00327101-10-05-2022-04-43-59.jpg",IMDb_rat:8.3},
{name:"Sherdil - The Pilibhit Saga",release_date:"24 Jun, 2022",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/sherdil--the-pilibhit-saga-et00328915-1655977142.jpg",IMDb_rat:6.0},
{name:"Jurassic World: Dominion",release_date:"10 Jun, 2022",poster:"https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/jurassic-world-dominion-et00112828-21-04-2022-06-44-15.jpg",IMDb_rat:6.7},
]

function displayData(fav_movies){
    document.getElementById("movies").innerHTML="";
fav_movies.map(function(el){
let main=document.getElementById("movies");
let div=document.createElement("div");
let h2=document.createElement("h2");
h2.innerText=el.name;
let p=document.createElement("p");
p.innerText="Release Date:"+" "+el.release_date;
let img=document.createElement("img");
img.setAttribute("src",el.poster);
let p2=document.createElement("p");
p2.setAttribute("id","rat")
p2.innerText="IMDb Rating:"+" "+el.IMDb_rat;

div.append(img,h2,p,p2);
main.append(div);
moviesArr.push(el);
localStorage.setItem("movies",JSON.stringify(moviesArr));

})
}
displayData(fav_movies);


let sortDiv=document.getElementById("sort-buttons");
let lowTohigh_btn=document.createElement("button");
lowTohigh_btn.setAttribute("id","sort-lh")
lowTohigh_btn.innerText="Sort by low rating to high";
lowTohigh_btn.setAttribute("id","sort-hl")
lowTohigh_btn.addEventListener("click",function(){
    sortLowToHigh();
});

let highTolow_btn=document.createElement("button");
highTolow_btn.innerText="Sort by High rating to low";
highTolow_btn.addEventListener("click",function(){
    sortHighToLow();
});
sortDiv.append(lowTohigh_btn,highTolow_btn);


function sortLowToHigh(){
    fav_movies.sort(function (a, b) {
                 return a.IMDb_rat-b.IMDb_rat;   
            })
            displayData(fav_movies);
}

function sortHighToLow(){
    fav_movies.sort(function (a, b) {
        return b.IMDb_rat-a.IMDb_rat;   
   })
   displayData(fav_movies);
}
