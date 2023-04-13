// coupon
let total = 0;
let disc = 0;
let coupons = 200;
document.querySelector("#promobtn").addEventListener("click", applycoupon);
function applycoupon() {
  if (coupons == 200) {
    let per = total * 0.3;
    disc = total - per;
    document.querySelector("#saving_show").innerText =
      "Congrat!!, You have got 30% Discount";
    //  alert()
    document.querySelector("#totalprice").innerText = disc;
    total = disc;
  }
}

var loadcart = JSON.parse(localStorage.getItem("cart"));
var loadwishlist = JSON.parse(localStorage.getItem("wishlistItem")) || [];

let quat = 0;

let sum = 0;
loadcart.map(function (elem, index) {
  quat = loadcart.length;

  document.querySelector("#quantity").innerText = quat;
  document.getElementById("item").innerText = quat + " ";
  sum = sum + Number(elem.price);
  total = sum;
  document.querySelector("#totalprice").innerText = total;

  let div = document.createElement("div");
  let div2 = document.createElement("div");
  div2.setAttribute("class", "card");

  let img = document.createElement("img");
  img.setAttribute("src", elem.image_link);

  let h2 = document.createElement("h2");
  h2.innerText = elem.brand;

  let p = document.createElement("p");
  p.innerText = elem.name;
  let h3 = document.createElement("h2");
  h3.setAttribute("id", "price");
  h3.innerText = +elem.price;
  let h4 = document.createElement("p");
  h4.innerText = "You saved ₹650!";
  h4.style.color = "teal";

  // opt.createElement("option");

  var array1 = ["SIZE", "S", "M", "L"];
  let selectlist1 = document.createElement("select");
  selectlist1.id = "mySelect";
  for (var i = 0; i < array1.length; i++) {
    var option = document.createElement("option");
    option.value = array1[i];
    option.text = array1[i];
    selectlist1.appendChild(option);
  }

  var array2 = ["QTY", 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let selectlist2 = document.createElement("select");
  selectlist2.id = "mySelect2";
  for (var i = 0; i < array2.length; i++) {
    var option = document.createElement("option");
    option.value = array2[i];
    option.text = array2[i];
    selectlist2.appendChild(option);
  }

  let remove = document.createElement("button");
  remove.setAttribute("id", "delete_btn");
  remove.innerText = "remove";
  remove.addEventListener("click", function () {
    deleteitem(index);
  });

  let wishlist = document.createElement("button");
  wishlist.setAttribute("id", "wishlist_btn");
  wishlist.innerText = "Move to wishlist";
  wishlist.addEventListener("click", function () {
    movetowishlist(elem, index);
  });

  let hr = document.createElement("hr");
  div2.append(
    h2,
    p,
    h3,
    h4,
    // p2,
    // selectlist1,
    // selectlist2,
    hr,
    remove,
    wishlist
  );
  div.append(div2, img);
  document.querySelector("#cartitem").append(div);
});

document.querySelector("#placeorderbtn").addEventListener("click", pricestore);
function pricestore() {
  let totalamt = [{ total: total }];
  localStorage.setItem("pricestore", JSON.stringify(totalamt));
  window.location.href = "address.html";
}

function deleteitem(index) {
  //  alert(" working on delete ")
  loadcart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(loadcart));
  window.location.reload();
}
function movetowishlist(elem, index) {
  loadwishlist.push(elem);
  localStorage.setItem("wishlistItem", JSON.stringify(loadwishlist));
  localStorage.setItem("cart", JSON.stringify(loadcart));
  loadcart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(loadcart));
  alert("Added To Wishlist");
  window.location.reload();
}

document.getElementById("bag").addEventListener("click", function () {
  window.location.href = "./cart.html";
});
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "./index.html";
});
let Namearr = JSON.parse(localStorage.getItem("signUpData"));
Namearr.map(function (ele) {
  document.getElementById("sign_btn").disabled = true;
  document.getElementById("sign_btn").innerText = ele.name;
});
