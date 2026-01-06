# Sticky Notes App

Simple, browser-based sticky notes built with vanilla JavaScript. Create, edit, and delete notes with instant persistence in localStorage, customizable colors, and typography settings.

## Features

- Create, edit, and delete notes inline
- Color palette per note with quick counts by color
- Font controls (family, size, weight, text color) saved per user
- Light/dark mode toggle with saved preference
- Responsive layout with collapsible sidebar and keyboard-friendly inputs
- Data persistence in localStorage; works offline once loaded

## Tech Stack

- HTML
- CSS
- JavaScript (vanilla)

## How It Works

- Notes are stored as objects in localStorage (id, content, color index, language direction) for instant persistence.
- UI is rendered dynamically from the saved notes array; updates re-render the list to keep state in sync.
- Color palette and font settings are stored in localStorage and applied across all notes; counters show how many notes use each color.
- Light/dark mode preference is saved and reapplied on load; layout adjusts for desktop and mobile via a responsive sidebar.
- Event-driven updates handle note interactions and UI state changes.

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in your browser, or serve the folder with any static server (for example, `npx serve`).
3. Add, color, and format notes; changes save automatically in the browser.

## Folder Structure

```
stickyNotes/
├─ index.html      # App markup
├─ style.css       # Layout, theme, and component styling
└─ main.js         # Note logic, rendering, settings, and persistence
```

## Live Demo

https://ahmed-adel-morsi.github.io/Sticky-Notes/

## Clean Code and Simplicity

- No external frameworks; readable functions for note creation, updates, and settings
- Minimal dependencies and straightforward DOM updates for easy maintenance
