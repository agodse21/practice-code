// add js part for newNote page here
let data = JSON.parse(localStorage.getItem("notes")) || [];

let total_notes = document.getElementById("total_notes"); // to add no of notes
total_notes.textContent = data.length ?? 0;

let btn = document.getElementById("add_note");
btn.addEventListener("click", function () {
  let title = document.getElementById("new_title").value;
  let title = document.getElementById("new_title").value;
  let desc = document.getElementById("new_description").value;
  const note = {
    title: title,
    description: desc,
  };
  data.push(note);
  localStorage.setItem("notes", JSON.stringify(data));
  window.location.reload();
});
btn.setAttributes("class","easy_edit")
