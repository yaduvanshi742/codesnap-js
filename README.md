# CodeSnap JS

<div align="center">

**A powerful local-first developer workspace for managing code snippets, notes, collections, playground experiments, tags, backups, and offline developer knowledge.**

CodeSnap JS is built for developers who want a fast, organized, and private place to save reusable code, document ideas, test frontend snippets, and manage their personal coding library directly in the browser.

</div>

---

## Overview

CodeSnap JS is a modern JavaScript-based developer workspace designed to help programmers save, organize, search, preview, and manage reusable code snippets.

It started as a simple snippet manager and has evolved into a complete local-first developer knowledge base. The app includes snippet management, folders, collections, developer notes, tag management, version history, a live code playground, analytics, workspace backups, PWA support, and offline usage.

Everything runs in the browser. There is no backend, no login system, and no external database. Your data stays on your device using IndexedDB.

---

## Why CodeSnap JS?

Developers often reuse small pieces of code: helper functions, API examples, UI components, CSS patterns, configuration snippets, terminal commands, and quick notes.

Keeping those snippets inside random files, chats, bookmarks, or note apps becomes messy over time.

CodeSnap JS solves that by giving you one clean workspace where you can:

- Save useful snippets
- Organize code by folders and collections
- Add notes and explanations
- Search across your developer knowledge
- Preview and copy code quickly
- Track snippet versions
- Test HTML, CSS, and JavaScript in a playground
- Export and restore your workspace anytime

---

## Features

### Snippet Management

- Create, edit, delete, archive, and favorite snippets
- Add title, description, language, category, tags, and folder
- Copy snippet code with one click
- View recent snippets and frequently used languages
- Organize reusable code in a clean developer-focused interface

### Folder System

- Create folders for different snippet groups
- Move snippets into folders
- Filter snippets by folder
- Track snippet count inside each folder
- Keep code organized by topic, project, or language

### Collections

- Group related snippets into collections
- Add descriptions and cover colors
- Build focused libraries such as React Hooks, JavaScript Utilities, CSS Components, API Examples, or Node Helpers
- View collection-based statistics and related snippets

### Developer Notes

- Create notes for technical explanations, project ideas, commands, fixes, and references
- Link notes with snippets
- Keep documentation beside reusable code
- Build a personal developer knowledge base

### Code Playground

- Write HTML, CSS, and JavaScript
- Preview frontend experiments directly in the browser
- Test small UI ideas before saving them
- Save playground code as reusable snippets

### Version History

- Store previous versions when snippets are updated
- View edit history
- Restore older versions when needed
- Keep track of how a snippet changed over time

### Tag Manager

- View all tags used across snippets
- Rename tags
- Remove unused tags
- Track tag usage count
- Improve search and organization

### Smart Search

- Search snippets, notes, folders, collections, languages, tags, and code content
- Use filters for faster navigation
- Quickly find saved solutions and reusable code
- Reduce time spent searching through old files

### Command Palette

- Open quick actions using `Ctrl + K`
- Search workspace items
- Create snippets faster
- Jump to main sections
- Trigger common actions without using the mouse

### Analytics

- View total snippets, notes, folders, collections, and tags
- Track most used languages
- View recent activity
- See productivity and workspace usage insights
- Understand how your snippet library grows over time

### Backup and Restore

- Export full workspace data as JSON
- Import previous backups
- Export snippets in developer-friendly formats
- Prevent accidental data loss
- Move your local workspace between browsers or devices manually

### PWA and Offline Support

- Installable as a Progressive Web App
- Works offline after the first load
- Uses a service worker to cache important app files
- Designed for fast local usage

### Theme and Settings

- Light and dark mode support
- Workspace preferences
- Default snippet options
- Data reset tools
- Local-first settings saved in the browser

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling, layout, responsiveness, and UI design |
| JavaScript | App logic, routing, state, and user interactions |
| IndexedDB | Local database for snippets, notes, folders, collections, and settings |
| Service Worker | Offline support and asset caching |
| Web App Manifest | PWA installation support |
| Local Browser APIs | Clipboard, file import/export, notifications, and storage |

---

## Project Structure

```text
codesnap-js-v4/
├── index.html
├── package.json
├── manifest.json
├── service-worker.js
├── README.md
├── .gitignore
├── public/
│   └── icons/
├── src/
│   ├── app/
│   ├── config/
│   ├── core/
│   ├── data/
│   ├── features/
│   │   ├── analytics/
│   │   ├── backup/
│   │   ├── command/
│   │   ├── collections/
│   │   ├── dashboard/
│   │   ├── exporter/
│   │   ├── folders/
│   │   ├── notes/
│   │   ├── playground/
│   │   ├── search/
│   │   ├── settings/
│   │   ├── shortcuts/
│   │   ├── snippets/
│   │   ├── tags/
│   │   └── templates/
│   ├── styles/
│   ├── ui/
│   └── utils/
├── docs/
├── scripts/
└── tests/
```

---

## Folder Explanation

| Folder | Purpose |
|---|---|
| `src/app` | Main app initialization and layout control |
| `src/config` | App constants and configuration values |
| `src/core` | Core state, routing, and shared app logic |
| `src/data` | IndexedDB connection, repositories, and data handling |
| `src/features` | Main feature modules of the application |
| `src/styles` | CSS files split by layout, components, views, and responsive rules |
| `src/ui` | Reusable UI components |
| `src/utils` | Helper functions used across the app |
| `public` | Static public assets |
| `docs` | Project documentation |
| `scripts` | Utility scripts for checking and development |
| `tests` | Test files for app logic and utilities |

---

## Getting Started

CodeSnap JS is a frontend-only project. It does not require a backend server or database setup.

### Clone the Repository

```bash
git clone https://github.com/yaduvanshi742/codesnap-js.git
cd codesnap-js
```

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

You can also open `index.html` directly in the browser, but using a local server is recommended for service worker and module-based browser features.

---

## Available Scripts

```bash
npm run dev
```

Starts a local development server.

```bash
npm run check
```

Checks JavaScript files for syntax errors.

```bash
npm test
```

Runs the included test files.

---

## Usage Guide

### Add a Snippet

Open the snippets section and create a new snippet with a title, language, description, tags, folder, and code content.

### Organize Snippets

Use folders, collections, and tags to keep snippets easy to find. You can organize snippets by language, project type, use case, or personal workflow.

### Use the Playground

Open the playground section to test HTML, CSS, and JavaScript together. Use it for small frontend experiments, UI demos, and quick code testing.

### Write Developer Notes

Use the notes section to store explanations, commands, debugging steps, learning notes, or project documentation.

### Search Everything

Use the search bar or command palette to quickly find snippets, notes, collections, tags, and folders.

### Backup Your Workspace

Export your workspace as a JSON backup and keep it somewhere safe. You can import the backup later to restore your data.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` | Open command palette |
| `Ctrl + N` | Create new snippet |
| `Ctrl + S` | Save current form |
| `Ctrl + E` | Export workspace |
| `/` | Focus search |
| `Esc` | Close modal, drawer, or command palette |

---

## Data Storage

CodeSnap JS stores data locally in the browser using IndexedDB.

This means:

- Your snippets stay private
- No account is required
- No server is required
- The app can work offline
- Data stays in the browser where it was created
- Clearing browser storage can remove saved data

For safety, export a backup regularly from the backup section.

---

## Offline and PWA Support

CodeSnap JS includes a web app manifest and service worker.

After the app loads once, supported browsers can cache the main files and allow the app to work offline. The app can also be installed on desktop or mobile as a Progressive Web App.

For best results, run or deploy the project over HTTPS. GitHub Pages, Netlify, Vercel, and Cloudflare Pages all support HTTPS by default.

---

## Deployment

CodeSnap JS can be deployed on any static hosting platform.

Good deployment options:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Firebase Hosting

### Deploy on GitHub Pages

1. Push the project to GitHub.
2. Open the repository settings.
3. Go to **Pages**.
4. Select **Deploy from a branch**.
5. Choose the `main` branch.
6. Select the root folder.
7. Save the settings.

Your site will be available at:

```text
https://yaduvanshi742.github.io/codesnap-js/
```

---

## Documentation

More project details are available inside the `docs` folder.

| File | Description |
|---|---|
| `docs/ARCHITECTURE.md` | Explains the app structure and module design |
| `docs/DEPLOYMENT.md` | Explains deployment steps |
| `docs/FEATURES.md` | Explains the main app features |

---

## Code Quality

The project is structured to be easy to understand and maintain.

It uses:

- Modular JavaScript files
- Feature-based folder organization
- Separate data layer
- Reusable UI utilities
- Local-first architecture
- Simple test files
- Clean naming and separation of concerns

---

## Browser Support

CodeSnap JS works best in modern browsers that support IndexedDB, service workers, JavaScript modules, and modern CSS.

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Firefox
- Brave
- Safari

---

## Best Use Cases

CodeSnap JS is useful for:

- JavaScript utility functions
- HTML and CSS components
- API request examples
- React snippets
- Node.js helper code
- Terminal commands
- Debugging notes
- Personal coding references
- Learning notes
- Frontend playground experiments

---

## Future Improvements

Possible future upgrades:

- Cloud sync
- GitHub Gist API integration
- Markdown preview for notes
- Full code editor integration
- Import from external snippet files
- Workspace encryption
- Multi-device sync
- More export formats
- Custom themes
- Advanced search operators
- Snippet sharing links

---

## Author

**Yadhuvanshi**

JavaScript Developer focused on building useful, organized, and practical web projects.

GitHub: [@yaduvanshi742](https://github.com/yaduvanshi742)

---

## Final Note

CodeSnap JS is built to be more than a simple snippet saver. It is a local-first developer workspace where code, notes, collections, tags, playground experiments, and backups live together in one clean interface.
