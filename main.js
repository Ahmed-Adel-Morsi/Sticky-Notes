let notes = document.querySelector(".notes");
let addBtn = document.querySelector(".add-btn");
let notesCounter = document.querySelector(".notes-counter");

let menuBtn = document.getElementById("menu-btn");
let modeInput = document.querySelector(".mode-input");

let fontFamily = document.getElementById("font-family");
let weight = document.getElementById("weight");
let fontColor = document.getElementById("font-color");
let size = document.getElementById("size");
let rest = document.getElementById("reset");

let hamburger = document.querySelector(".hamburger");
let sidebarHeader = document.querySelector(".sidebar-header");
let closeNavBtn = document.querySelector(".sidebar-x");

let left = document.querySelector(".left");
let right = document.querySelector(".right");
let section = document.querySelector("section");
let header = document.querySelector("header");

let notesArray, colorCount, mode, fontSettings;

let colors;
if (localStorage.getItem("colors")) {
  colors = JSON.parse(localStorage.getItem("colors"));
  document.querySelectorAll(".color-picker input[type=color]").forEach((e) => {
    e.value = colors[e.dataset.index];
  });
} else {
  colors = ["#938c8d", "#ffb900", "#ff6001", "#ff1e71", "#864af3", "#2f86ff"];
  localStorage.setItem("colors", JSON.stringify(colors));
}

if (localStorage.getItem("mode")) {
  mode = localStorage.getItem("mode");
  if (mode === "dark") {
    modeInput.setAttribute("checked", "checked");
  }
}

if (localStorage.getItem("notes")) {
  notesArray = JSON.parse(localStorage.getItem("notes"));
  updatePage();
  updateColorCount();
} else {
  notesArray = [];
}

if (localStorage.getItem("font")) {
  fontSettings = JSON.parse(localStorage.getItem("font"));
  updateFontSettings();
  updateSideFontSettings();
} else {
  fontSettings = {
    "font-weight": "normal",
    "font-size": "20px",
    "font-family": "'Cairo', sans-serif",
    color: "#ffffff",
  };
}

window.onresize = screenDimension;
window.onload = screenDimension;

function screenDimension() {
  if (window.innerWidth <= 1000) {
    section.appendChild(notesCounter.parentElement);
  } else {
    right.appendChild(notesCounter.parentElement);
  }
  if (window.innerWidth <= 700) {
    header.after(left);
  } else {
    document.querySelector(".page-content").prepend(left);
    document.body.classList.remove("sidebar-open");
    sidebarHeader.classList.add("hide");
    left.style.removeProperty("width");
  }
}

hamburger.onclick = function () {
  left.style.width = "250px";
  document.body.classList.add("sidebar-open");
  sidebarHeader.classList.remove("hide");
};

closeNavBtn.onclick = function () {
  left.style.width = "0";
  document.body.classList.remove("sidebar-open");
  sidebarHeader.classList.add("hide");
};

function updateFontSettings() {
  let keys = Object.keys(fontSettings);
  let values = Object.values(fontSettings);
  for (let i = 0; i < keys.length; i++) {
    document.querySelectorAll("textarea").forEach((e) => {
      e.style.setProperty(keys[i], values[i]);
    });
  }
  localStorage.setItem("font", JSON.stringify(fontSettings));
}

function updateSideFontSettings() {
  let keys = Object.keys(fontSettings);
  let values = Object.values(fontSettings);
  for (let i = 0; i < keys.length; i++) {
    document
      .querySelectorAll(".font-settings select, .font-settings input")
      .forEach((e) => {
        if (e.id === keys[i]) {
          e.value = keys[i] === "font-size" ? parseInt(values[i]) : values[i];
        }
      });
  }
}

document
  .querySelectorAll(".font-settings select, .font-settings input")
  .forEach((e) => {
    e.addEventListener("input", function () {
      fontSettings[this.id] =
        this.id != "font-size" ? this.value : `${this.value}px`;
      updateFontSettings();
    });
  });

function createNote(id, colorIndex, content, lang) {
  let note = document.createElement("div");
  note.classList.add("note", "card");
  note.id = id;
  note.style.backgroundColor = colors[colorIndex];

  for (let i = 0; i < colors.length; i++) {
    let span = document.createElement("span");
    span.setAttribute("data-color", colors[i]);
    span.style.backgroundColor = colors[i];
    span.className = "color";

    span.onclick = function () {
      span.parentElement.querySelector("textArea").style.backgroundColor =
        span.dataset.color;
      span.parentElement.style.backgroundColor = span.dataset.color;
      updateNoteColor(id, span.dataset.color);
      updateColorCount();
    };

    note.appendChild(span);
  }

  let textArea = document.createElement("textarea");
  textArea.name = "content";
  textArea.placeholder = "Type any Note";
  textArea.style.backgroundColor = colors[colorIndex];
  textArea.value = content;

  if (lang === "ar") textArea.dir = "rtl";
  else textArea.dir = "ltr";

  textArea.oninput = function () {
    updateNoteContent(id, textArea.value);
    if (getLang(id) === "ar") {
      textArea.dir = "rtl";
      setLang(id, "ar");
    } else {
      textArea.dir = "ltr";
      setLang(id, "en");
    }
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
    colorIndex: 0,
    content: "",
    lang: "en",
  });
  updatePage();
  updateLocalStorage();
}

function updatePage() {
  document.querySelectorAll(".note").forEach((e) => e.remove());
  for (let i = 0; i < notesArray.length; i++) {
    let note = createNote(
      notesArray[i].id,
      notesArray[i].colorIndex,
      notesArray[i].content,
      notesArray[i].lang
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
      notesArray[i].colorIndex = colors.indexOf(value);
      updateLocalStorage(notesArray);
      break;
    }
  }
}

addBtn.onclick = function () {
  createNoteObject();
  updateColorCount();
  updateFontSettings();
  document.querySelector(".note textArea").focus();
};

function updateCountArray() {
  colorCount = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < notesArray.length; i++) {
    // console.log(notesArray[i].colorIndex);
    colorCount[notesArray[i].colorIndex]++;
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

function getLang(id) {
  for (let i = 0; i < notesArray.length; i++) {
    if (id === notesArray[i].id) {
      return /[\u0600-\u06FF]/.test(notesArray[i].content) ? "ar" : "en";
    }
  }
}
function setLang(id, value) {
  for (let i = 0; i < notesArray.length; i++) {
    if (id === notesArray[i].id) {
      notesArray[i].lang = value;
      updateLocalStorage();
      break;
    }
  }
}

modeInput.onchange = function () {
  if (modeInput.checked) localStorage.setItem("mode", "dark");
  else localStorage.setItem("mode", "light");
};

rest.onclick = function () {
  colors = ["#938c8d", "#ffb900", "#ff6001", "#ff1e71", "#864af3", "#2f86ff"];
  localStorage.setItem("colors", JSON.stringify(colors));
  updatePage();

  fontSettings = {
    "font-weight": "normal",
    "font-size": "20px",
    "font-family": "'Cairo', sans-serif",
    color: "#ffffff",
  };
  updateFontSettings();
  updateSideFontSettings();
};

document.querySelectorAll(".color-picker input[type=color]").forEach((e) => {
  e.addEventListener("input", function (event) {
    colors[event.target.dataset.index] = this.value;
  });
  e.addEventListener("change", function (event) {
    localStorage.setItem("colors", JSON.stringify(colors));
    updatePage();
  });
});
