# Rocket React Calculator

A simple calculator built with React, Vite, and Tailwind CSS. It supports basic arithmetic operations and keeps an operation history persisted in `localStorage`.

## Features

- Addition, subtraction, multiplication, and division
- Operation history with a clear/reset action
- Responsive UI styled with Tailwind CSS

## Tech Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Oxlint](https://oxc.rs) for linting

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Calculator.jsx   # Calculator keypad and display logic
│   └── History.jsx      # Operation history list
├── hooks/
│   └── useHistory.js    # Persists history to localStorage
├── utils/
│   └── calculator.js    # Arithmetic and formatting helpers
├── App.jsx
└── main.jsx
```
