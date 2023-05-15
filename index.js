// add js part for index page here

let total_notes = document.getElementById("total_notes"); // to add no of notes

let data = JSON.parse(localStorage.getItem("notes")) || [];
//if notes having length!=0 then Append notes in this div
let notes_container = document.getElementById("notes_container");
let search_btn = document.getElementById("search_btn");
search_btn.addEventListener("click", function () {
  let Search = document.getElementById("Search").value;
  let temp = data.filter((ele) => ele.title == Search);
  if (temp.length > 0) {
    disPlay(temp);
  } else {
    notes_container.innerHTML = "";
    let h1 = document.createElement("h1");
    h1.setAttribute("id", "add_notes_text");
    h1.innerText = "Add notes / Result not found !";
    notes_container.append(h1);
  }
});
// if notes having length= 0
let h1 = document.createElement("h1");
h1.setAttribute("id", "add_notes_text");
h1.innerText = "Add notes / Result not found !";
notes_container.append(h1);

total_notes.textContent = data.length;

function disPlay() {
  data.map((ele, i) => {
    console.log(ele);
    notes_container.innerHTML = "";
    let h3 = document.createElement("h3");
    h3.textContent = ele.title;
    h3.setAttribute("id", "title");
    let desc = document.createElement("p");
    desc.textContent = ele.description;
    desc.setAttribute("id", "description");
    let edit_div = document.createElement("div");
    edit_div.setAttribute("id", "edit_div");
    edit_div.style.display = "none";
    let edit = document.createElement("button");
    edit.textContent = "Edit";

    edit.setAttribute("id", "edit_btn");

    edit.addEventListener("click", function () {
      edit_div.style.display = "block";

      edit_div.innerHTML = `<p>Title</p>
<input type="text" value id="edit_title" placeholder="add title" />
<p>description</p>
<textarea
  type="text"
  value
  id="edit_description"
  placeholder="new_description"
></textarea>

<button id="edit_submit_btn">Add note</button>`;
      let edit_btn = document.getElementById("edit_submit_btn");
      edit_btn.addEventListener("click", function () {
        let edit_title = document.getElementById("edit_title").value;
        let edit_desc = document.getElementById("edit_description").value;

        data[i] = { title: edit_title, description: edit_desc };
        localStorage.setItem("notes", JSON.stringify(data));
        window.location.reload();
      });
    });

    let delet = document.createElement("button");
    delet.textContent = "Delete";
    delet.setAttribute("id", "delete_btn");
    delet.addEventListener("click", function () {
      const deletedNote = data.splice(i, 1);
      const deletedNotes =
        JSON.parse(localStorage.getItem("deleted_notes")) || [];
      deletedNotes.push(deletedNote[0]);
      localStorage.setItem("notes", JSON.stringify(data));
      localStorage.setItem("deleted_notes", JSON.stringify(deletedNotes));
      window.location.reload();
    });
    notes_container.append(h3, desc, edit, delet, edit_div);
  });
}

disPlay();
