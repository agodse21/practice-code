import navbar from "../components/navbar.js";

let nav = document.getElementById("navbar");
nav.innerHTML = navbar();
let userarr = JSON.parse(localStorage.getItem("getusername"));
userarr.map((ele) => {
  let user = document.getElementById("user_show");
  user.innerText = ele.name;
});

// id="sort">Sort By Asending</button>
// <button class="btn_f" id="fil_price">Filter Price<200</button>
// <button class="btn_f" id="fil_rat">
document.getElementById("sort").addEventListener("change", function () {
  sortA();
});
let sortA = async () => {
  let selected = document.getElementById("sort").value;

  if (selected == "asc") {
    let res = await fetch(
      `http://127.0.0.1:3005/api/products/?_sort=price&_order=asc`
    );
    let data = await res.json();
    // console.log(data)
    append(data);
  } else if (selected == "desc") {
    let res = await fetch(
      `http://127.0.0.1:3005/api/products/?_sort=price&_order=desc`
    );
    let data = await res.json();
    // console.log(data)
    append(data);
  }
};

document.getElementById("fil_price").addEventListener("change", function () {
  fil_price();
});
let fil_price = async () => {
  let selected = document.getElementById("fil_price").value;
  if (selected == "two") {
    let res = await fetch(`http://127.0.0.1:3005/api/products/?price_lte=200`);
    let data = await res.json();
    // console.log(data)
    append(data);
  }else if (selected == "fourt") {
    let res = await fetch(`http://127.0.0.1:3005/api/products/?price_lte=400`);
    let data = await res.json();
    // console.log(data)
    append(data);
  }
};
document.getElementById("fil_rat").addEventListener("change", function () {
  fil_rat();
});
let fil_rat = async () => {
  let selected = document.getElementById("fil_rat").value;
  if (selected == "three") {
    let res = await fetch(`http://127.0.0.1:3005/api/products/?ratings_gte=3`);
    let data = await res.json();
    // console.log(data)
    append(data);
  }else if (selected == "four") {
    let res = await fetch(`http://127.0.0.1:3005/api/products/?ratings_gte=4`);
    let data = await res.json();
    // console.log(data)
    append(data);
  }
};


async function showproduct() {
  let response = await fetch(`http://127.0.0.1:3005/api/products`, {});
  let data = await response.json();
  // console.log(data);
  append(data);
}
showproduct();

let append = (data) => {
  let display = document.getElementById("display");
  display.innerHTML = "";
  data.forEach((ele) => {
    console.log(ele);

    let div = document.createElement("div");

    let img = document.createElement("img");
    img.src = ele.image;
    let div1 = document.createElement("div");
    let title = document.createElement("h3");
    title.innerText = ele.title;
    let id = document.createElement("p");
    id.innerText = `ID- ${ele.id}`;
    let desc = document.createElement("p");
    desc.innerText = ele.description;
    let rating = document.createElement("p");
    rating.innerHTML = `&#9734  ${ele.ratings}`;
    let price = document.createElement("h2");
    price.innerHTML = `&#8377 ${ele.price}`;

    let btn = document.createElement("button");
    btn.innerText = "Order Food";
    btn.setAttribute("class", "orderbtn");
    btn.addEventListener("click", function () {
      placeOrder(ele);
    });

    div1.append(title, id, desc, price, rating, btn);
    div.append(img, div1);
    display.append(div);
  });
};

let placeOrder = (data) => {
 window.location.href="./order.html"
};
