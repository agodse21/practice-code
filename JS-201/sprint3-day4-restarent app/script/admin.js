import navbar from "../components/navbar.js";

let nav = document.getElementById("navbar");
nav.innerHTML = navbar();

let userarr = JSON.parse(localStorage.getItem("getusername"));
userarr.map((ele) => {
  let user = document.getElementById("user_show");
  user.innerText = ele.name;
});

let form = document.getElementById("add_product");
form.addEventListener("submit", addProduct);

async function addProduct(e) {
  e.preventDefault();

  let product = {
    id: document.getElementById("id").value,
    title: document.getElementById("title").value,
    price:+document.getElementById("price").value,
    description: document.getElementById("desc").value,
    ratings: +document.getElementById("rat").value,
    image: document.getElementById("img").value,
  };

  product = JSON.stringify(product);

  let product_api_url = `http://127.0.0.1:3005/api/products`;
  let response = await fetch(product_api_url, {
    method: `POST`,
    body: product,

    headers: {
      "Content-Type": "application/json",
    },
  });
  // let data=await response.json();
  console.log(response);
}

//delete product

let form2 = document.getElementById("delete_product");
form2.addEventListener("submit", deleteProduct);

async function deleteProduct(e) {
  e.preventDefault();

  let id = document.getElementById("id1").value;

  let response = await fetch(`http://127.0.0.1:3005/api/products/${id}`, {
    method: `DELETE`,

    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();
  console.log(data);
}

let form3 = document.getElementById("update_product");
form3.addEventListener("submit", updateProduct);

async function updateProduct(e) {
  e.preventDefault();
  let product = {
    title: document.getElementById("title2").value,
    price:+ document.getElementById("price2").value,
    description: document.getElementById("desc2").value,
    ratings:+ document.getElementById("rat2").value,
    image: document.getElementById("img2").value,
  };

  product = JSON.stringify(product);
  let id2 =+ document.getElementById("id2").value;

  let res = await fetch(`http://127.0.0.1:3005/api/products/${id2}`, {
    method: 'PATCH',
    body: product,

    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await res.json();
  console.log(data);
}
