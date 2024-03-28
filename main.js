let notes = document.querySelector(".notes");
let addBtn = document.querySelector(".add-btn");
let notesCounter = document.querySelector(".notes-counter");
let colors = ["#938c8d", "#ffb900", "#ff6001", "#ff1e71", "#864af3", "#2f86ff"];

let notesArray, colorCount;

if (localStorage.getItem("notes")) {
  notesArray = JSON.parse(localStorage.getItem("notes"));
  updatePage();
  updateColorCount();
} else {
  notesArray = [];
}

function createNote(id, color, content) {
  let note = document.createElement("div");
  note.classList.add("note", "card");
  note.id = id;
  note.style.backgroundColor = color;

  for (let i = 0; i < colors.length; i++) {
    let span = document.createElement("span");
    span.setAttribute("data-color", colors[i]);
    span.style.backgroundColor = colors[i];
    span.className = "color";

    span.onclick = function () {
      span.parentElement.children[6].style.backgroundColor = span.dataset.color;
      span.parentElement.style.backgroundColor = span.dataset.color;
      updateNoteColor(id, span.dataset.color);
      updateColorCount();
    };

    note.appendChild(span);
  }

  let textArea = document.createElement("textarea");
  textArea.name = "content";
  textArea.placeholder = "Type any Note";
  textArea.style.backgroundColor = color;
  textArea.value = content;

  textArea.oninput = function () {
    updateNoteContent(id, textArea.value);
  };

  note.appendChild(textArea);

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "del-btn";
  deleteBtn.textContent = "Delete";

  deleteBtn.onclick = function () {
    deleteNote(id);
  };

  note.appendChild(deleteBtn);

  return note;
}

function createNoteObject() {
  notesArray.push({
    id: Date.now(),
    color: "#938c8d",
    content: "",
  });
  updatePage();
  updateLocalStorage();
}

function updatePage() {
  document.querySelectorAll(".note").forEach((e) => e.remove());
  for (let i = 0; i < notesArray.length; i++) {
    let note = createNote(
      notesArray[i].id,
      notesArray[i].color,
      notesArray[i].content
    );
    notes.prepend(note);
  }
}

function deleteNote(id) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id === id) {
      notesArray.splice(i, 1);
      updatePage();
      updateLocalStorage(notesArray);
      updateColorCount();
      break;
    }
  }
}

function updateLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notesArray));
}

function updateNoteContent(id, value) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id === id) {
      notesArray[i].content = value;
      updateLocalStorage(notesArray);
      break;
    }
  }
}

function updateNoteColor(id, value) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id == id) {
      notesArray[i].color = value;
      updateLocalStorage(notesArray);
      break;
    }
  }
}

addBtn.onclick = function () {
  createNoteObject();
  updateColorCount();
  document.querySelector(".note").children[6].focus();
};

function updateCountArray() {
  colorCount = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < notesArray.length; i++) {
    colorCount[colors.indexOf(notesArray[i].color)]++;
  }
}

function updateColorCount() {
  notesCounter.innerHTML = "";
  updateCountArray();
  for (let i = colorCount.length - 1; i >= 0; i--) {
    if (colorCount[i] > 0) createCountCard(colorCount[i], colors[i]);
  }
}

function createCountCard(count, color) {
  let div = document.createElement("div");

  let span = document.createElement("span");
  span.style.backgroundColor = color;
  div.appendChild(span);

  div.appendChild(
    document.createTextNode(`${count} Note${count > 1 ? "s" : ""}`)
  );

  notesCounter.appendChild(div);
}
