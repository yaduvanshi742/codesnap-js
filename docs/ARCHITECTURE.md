# Architecture

CodeSnap JS V4 uses a modular frontend architecture with ES modules. Each feature owns its own view and service files so the project stays easier to extend.

## Main Layers

- `src/app` controls application lifecycle and shared state.
- `src/data` handles IndexedDB and repository access.
- `src/features` contains business features such as snippets, notes, collections, playground, analytics, and backup.
- `src/ui` contains reusable UI helpers.
- `src/utils` contains small pure utility functions.
- `src/styles` separates base, layout, component, view, and responsive styles.

## Data Model

The app stores data in IndexedDB stores:

- snippets
- folders
- collections
- notes
- versions
- playgrounds
- settings
- activity
