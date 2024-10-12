// add js part for deleted page here

let total_notes = document.getElementById("total_notes"); // to add no of deleted notes
let data = JSON.parse(localStorage.getItem("deleted_notes")) || [];
total_notes.textContent = data.length ||0

//if deleted notes having length !=0 then Append deleted_notes in this div
let notes_container = document.getElementById("notes_container");
let notes_container = document.getElementById("notes_container");

// if deleted notes having length= 0
let h1 = document.createElement("h1");
h1.setAttribute("id", "add_notes_text");
h1.setAttribute("class", "add_nottes_text_class");
h1.innerText = "Add notes / Result not found !";
notes_container.append(h1);

function disPlay() {
  data.map((ele, i) => {
    console.log(ele);
    notes_container.innerHTML = "";
    let box = document.createElement("div");
    box.setAttribute("id", "box");
    let h3 = document.createElement("h3");
    h3.textContent = ele.title;
    h3.setAttribute("id", "title");
    let desc = document.createElement("p");
    desc.textContent = ele.description;
    desc.setAttribute("id", "description");

    let btn = document.createElement("button");
    btn.textContent = "addAgain_btn";
    btn.setAttribute("addAgain_btn");
    btn.addEventListener("click", function () {});
   btn.setAttribute("class","btn");
    box.append(h3, desc, btn);
    notes_container.append(box);
    
  });
}

disPlay();
