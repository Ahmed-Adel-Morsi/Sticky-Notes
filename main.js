let notes = document.querySelector(".notes");
let addBtn = document.querySelector(".add-btn");
let notesCounter = document.querySelector(".notes-counter");

let modeInput = document.querySelector(".mode-input");

let reset = document.getElementById("reset");

let hamburger = document.querySelector(".hamburger");
let closeNavBtn = document.querySelector(".sidebar-x");

let overlay = document.querySelector(".overlay");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let section = document.querySelector("section");
let header = document.querySelector("header");

let colorInputs = document.querySelectorAll(".color-picker input[type=color]");
let fontSettingInputs = document.querySelectorAll(
  ".font-settings select, .font-settings input"
);

let notesArray, colorCount, mode, fontSettings, colors;

if (localStorage.getItem("mode")) {
  if (localStorage.getItem("mode") === "dark") {
    modeInput.setAttribute("checked", "checked");
  }
}

if (localStorage.getItem("colors")) {
  colors = JSON.parse(localStorage.getItem("colors"));
  updateSidebarColors();
} else {
  resetColorSettings();
}

if (localStorage.getItem("font")) {
  fontSettings = JSON.parse(localStorage.getItem("font"));
  updateSideFontSettings();
} else {
  resetFontSettings();
}

if (localStorage.getItem("notes")) {
  notesArray = JSON.parse(localStorage.getItem("notes"));
  updatePage();
} else {
  notesArray = [];
}

window.onresize = screenDimension;
window.onload = screenDimension;

hamburger.onclick = openSidebar;

closeNavBtn.onclick = closeSidebar;
overlay.onclick = closeSidebar;

addBtn.onclick = createNoteObject;

reset.onclick = resetAllSettings;

modeInput.onchange = function () {
  if (modeInput.checked) saveMode("dark");
  else saveMode("light");
};

colorInputs.forEach((e) => {
  e.addEventListener("input", function (event) {
    colors[event.target.dataset.index] = this.value;
    updateAllNotesColor();
  });
  e.addEventListener("change", saveColorPalette);
});

fontSettingInputs.forEach((e) => {
  e.addEventListener("input", function () {
    fontSettings[this.id] =
      this.id != "font-size" ? this.value : `${this.value}px`;
    updateFontSettings();
  });
  e.addEventListener("change", saveFontSettings);
});

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
    closeSidebar();
  }
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  left.style.removeProperty("width");
  left.style.removeProperty("border-right");
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  left.style.width = "min(250px, 100%)";
  left.style.borderRight = "1px solid var(--main-border-color)";
}

function updateFontSettings() {
  let entries = Object.entries(fontSettings);
  for (let i = 0; i < entries.length; i++) {
    document.querySelectorAll("textarea").forEach((e) => {
      e.style.setProperty(entries[i][0], entries[i][1]);
    });
  }
}

function updateSideFontSettings() {
  let entries = Object.entries(fontSettings);
  for (let i = 0; i < entries.length; i++) {
    fontSettingInputs.forEach((e) => {
      if (e.id === entries[i][0]) {
        e.value =
          entries[i][0] === "font-size"
            ? parseInt(entries[i][1])
            : entries[i][1];
      }
    });
  }
}

function createNoteObject() {
  notesArray.push({
    id: Date.now(),
    colorIndex: 0,
    content: "",
    lang: "en",
  });
  updatePage();
  saveAllNotes();
  document.querySelector(".note textArea").focus();
}

function updatePage() {
  // Removes All Notes from page
  document.querySelectorAll(".note").forEach((e) => e.remove());
  // Add All Notes inside notes Array to the page
  for (let i = 0; i < notesArray.length; i++) {
    let note = createNote(
      notesArray[i].id,
      notesArray[i].colorIndex,
      notesArray[i].content,
      notesArray[i].lang
    );
    notes.prepend(note);
  }
  updateFontSettings();
  updateColorCount();
}

function createNote(id, colorIndex, content, lang) {
  let note = document.createElement("div");
  note.classList.add("note", "card");
  note.id = id;
  note.style.backgroundColor = colors[colorIndex];

  for (let i = 0; i < colors.length; i++) {
    let span = document.createElement("span");
    span.setAttribute("data-index", i);
    span.style.backgroundColor = colors[i];
    span.className = "color";

    span.onclick = function () {
      let index = span.dataset.index;
      span.parentElement.querySelector("textArea").style.backgroundColor =
        colors[index];
      span.parentElement.style.backgroundColor = colors[index];
      span.parentElement.querySelector("textarea").dataset.colorIndex = index;
      updateNoteColor(id, index);
    };

    note.appendChild(span);
  }

  let textArea = document.createElement("textarea");
  textArea.name = "content";
  textArea.placeholder = "Type any Note";
  textArea.style.backgroundColor = colors[colorIndex];
  textArea.value = content;
  textArea.setAttribute("data-color-index", colorIndex);

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

function deleteNote(id) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id === id) {
      notesArray.splice(i, 1);
      updatePage();
      saveAllNotes();
      break;
    }
  }
}

function updateNoteContent(id, value) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id === id) {
      notesArray[i].content = value;
      saveAllNotes();
      break;
    }
  }
}

function updateNoteColor(id, index) {
  for (let i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id == id) {
      notesArray[i].colorIndex = index;
      saveAllNotes();
      updateColorCount();
      break;
    }
  }
}

function updateAllNotesColor() {
  document.querySelectorAll(".note").forEach((note) => {
    note.querySelectorAll("span").forEach((span) => {
      span.style.backgroundColor = colors[span.dataset.index];
    });
    let textArea = note.querySelector("textarea");
    let color = colors[textArea.dataset.colorIndex];
    note.style.backgroundColor = color;
    textArea.style.backgroundColor = color;
  });
  updateColorCount();
}

function updateCountArray() {
  colorCount = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < notesArray.length; i++) {
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
      saveAllNotes();
      break;
    }
  }
}

function resetColorSettings() {
  colors = ["#164863", "#747264", "#65451F", "#0174BE", "#453F78", "#B2533E"];
  saveColorPalette();
}

function resetFontSettings() {
  fontSettings = {
    "font-weight": "normal",
    "font-size": "18px",
    "font-family": "'Cairo', sans-serif",
    color: "#ffffff",
  };
  saveFontSettings();
}

function resetAllSettings() {
  resetColorSettings();
  resetFontSettings();
  updatePageSettings();
}

function saveMode(mode) {
  localStorage.setItem("mode", mode);
}

function saveAllNotes() {
  localStorage.setItem("notes", JSON.stringify(notesArray));
}

function saveColorPalette() {
  localStorage.setItem("colors", JSON.stringify(colors));
}

function saveFontSettings() {
  localStorage.setItem("font", JSON.stringify(fontSettings));
}

function updateSidebarColors() {
  colorInputs.forEach((e) => {
    e.value = colors[e.dataset.index];
  });
}

function updatePageSettings() {
  updateAllNotesColor();
  updateSidebarSettings();
}

function updateSidebarSettings() {
  updateSideFontSettings();
  updateSidebarColors();
}
