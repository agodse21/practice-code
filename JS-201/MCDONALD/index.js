let btn = document.getElementById("place_order_btn");
btn.addEventListener("click", orderFood);

function orderFood(event) {
  let Big_Mac = document.getElementById("Big_Mac");
  let Chicken_McNuggets = document.getElementById("Chicken_McNuggets");
  let Iced_Coffee = document.getElementById("Iced_Coffee");
  let Egg_McMuffin = document.getElementById("Egg_McMuffin");
  let Apple_Slices = document.getElementById("Apple_Slices");

  // let bag ="";
  if (
    Big_Mac.checked == true &&
    Iced_Coffee.checked == true &&
    Chicken_McNuggets.checked == true &&
    Apple_Slices.checked == true &&
    Egg_McMuffin.checked == true
  ) {
    let h2 = document.getElementById("ready");
    h2.innerText = "Your Selected All Items";
    let imgdata = [
      "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Big-Mac-1:1-4-product-tile-desktop",
      "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Chicken-McNuggets-4pc-1:1-4-product-tile-desktop",
      "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Premium-Roast-Iced-Coffee-Medium:1-4-product-tile-desktop",
      "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Egg-McMuffin-1:1-4-product-tile-desktop",
      "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Apple-Slices:1-4-product-tile-desktop",
    ];

    alert("Your Oreder has been Placed. Wait a Momement!!");
    let food_promise = new Promise(function (resolve) {
      let order = kitchen();

      setTimeout(function () {
        if (order) {
          resolve("Done");
        }
      }, 5000);
    });

    food_promise.then(function (res) {
      console.log(res);
      let p = document.getElementById("Token");
      p.innerHTML = "<p>Token No:01</p>";
      h2.innerHTML = "<h2>Your Order is Ready!!</h2>";
      imgdata.map(function (ele) {
        let main = document.getElementById("all_food");
        let div = document.createElement("div");
        let img = document.createElement("img");
        img.setAttribute("src", ele);
        div.append(img);
        main.append(div);
      });
    });
  } else if (Big_Mac.checked == true) {
    // bag = Big_Mac.value;
    alert("Your Oreder has been Placed. Wait a Momement!!");
    let food_promise = new Promise(function (resolve) {
      let order = kitchen();

      setTimeout(function () {
        if (order) {
          resolve("Done");
        }
      }, 5000);
    });
    let dis = document.getElementById("display");
    let image = document.getElementById("img_s");
    let p = document.getElementById("Token");
    let h2 = document.getElementById("ready");
    food_promise.then(function (res) {
      console.log(res);
      p.innerHTML = "<p>Token No:02</p>";
      h2.innerHTML = "<h2>Your Order is Ready!!</h2>";

      image.src =
        "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Big-Mac-1:1-4-product-tile-desktop";
    });
  } else if (Chicken_McNuggets.checked == true) {
    bag = Chicken_McNuggets.value;
    alert("Your Oreder has been Placed. Wait a Momement!!");
    let food_promise = new Promise(function (resolve) {
      let order = kitchen();

      setTimeout(function () {
        if (order) {
          resolve("Done");
        }
      }, 5000);
    });
    let dis = document.getElementById("display");
    let image = document.getElementById("img_s");
    let p = document.getElementById("Token");
    let h2 = document.getElementById("ready");
    food_promise.then(function (res) {
      console.log(res);
      p.innerHTML = "<p>Token No:04</p>";
      h2.innerHTML = "<h2>Your Order is Ready!!</h2>";

      image.src =
        "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Chicken-McNuggets-4pc-1:1-4-product-tile-desktop";
    });
  } else if (Iced_Coffee.checked == true) {
    bag = Iced_Coffee.value;
    alert("Your Oreder has been Placed. Wait a Momement!!");
    let food_promise = new Promise(function (resolve) {
      let order = kitchen();

      setTimeout(function () {
        if (order) {
          resolve("Done");
        }
      }, 5000);
    });
    let dis = document.getElementById("display");
    let image = document.getElementById("img_s");
    let p = document.getElementById("Token");
    let h2 = document.getElementById("ready");
    food_promise.then(function (res) {
      console.log(res);
      p.innerHTML = "<p>Token No:05</p>";
      h2.innerHTML = "<h2>Your Order is Ready!!</h2>";

      image.src =
        "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Premium-Roast-Iced-Coffee-Medium:product-header-desktop?wid=830&hei=458&dpr=off";
    });
  } else if (Apple_Slices.checked == true) {
    bag = Apple_Slices.value;
    alert("Your Oreder has been Placed. Wait a Momement!!");
    let food_promise = new Promise(function (resolve) {
      let order = kitchen();

      setTimeout(function () {
        if (order) {
          resolve("Done");
        }
      }, 5000);
    });
    let dis = document.getElementById("display");
    let image = document.getElementById("img_s");
    let p = document.getElementById("Token");
    let h2 = document.getElementById("ready");
    food_promise.then(function (res) {
      console.log(res);
      p.innerHTML = "<p>Token No:10</p>";
      h2.innerHTML = "<h2>Your Order is Ready!!</h2>";

      image.src =
        "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Apple-Slices:1-4-product-tile-desktop";
    });
  } else if (Egg_McMuffin.checked == true) {
    bag = Egg_McMuffin.value;
    alert("Your Oreder has been Placed. Wait a Momement!!");
    let food_promise = new Promise(function (resolve) {
      let order = kitchen();

      setTimeout(function () {
        if (order) {
          resolve("Done");
        }
      }, 5000);
    });
    let dis = document.getElementById("display");
    let image = document.getElementById("img_s");
    let p = document.getElementById("Token");
    let h2 = document.getElementById("ready");
    food_promise.then(function (res) {
      console.log(res);
      p.innerHTML = "<p>Token No:08</p>";
      h2.innerHTML = "<h2>Your Order is Ready!!</h2>";

      image.src =
        "https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Egg-McMuffin-1:1-4-product-tile-desktop";
    });
  } else {
    let h2 = document.getElementById("ready");
    return (h2.innerText = "You have not selected Anything");
  }
}

function kitchen() {
  return true;
}
