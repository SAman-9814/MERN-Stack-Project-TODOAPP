# AetherFlow Workspace

AetherFlow is a premium, full-stack task management dashboard designed to streamline developer workflows. Powered by React, Tailwind CSS, Express, and MongoDB, it features fluid animations, custom card shaders, side drawers, priority tracking, due dates, tags, a Kanban Board, and dark/light theme persistency.

---

## ✨ Features

- **Unique Branding & Aesthetics**: Clean typography, glassmorphism headers, and floating ambient background glow spheres that shift colors depending on the active theme.
- **Double View Layout Mode (Grid / Kanban)**: Toggle layouts on-the-fly between a grid of responsive cards and a Kanban lanes column board (split into Pending and Completed).
- **Cursor-Following Glow Borders**: Advanced hover outline effects on task cards that track your cursor coordinates in real-time.
- **Slide-Over Sidebar Drawer**: Redesigned creation/editing panel sliding from the right edge with custom priority buttons (Low, Medium, High), due date timelines, and toggleable tags (`Code`, `Design`, `Planning`, `Personal`, `Finance`).
- **Custom Toast Notifications**: Fluid popup alerts with shrinking timer progress bars indicating auto-close times.
- **Persistent Theme Toggling**: Seamless transition between Light and Dark mode options stored in `localStorage`.

---

## 📂 Project Structure

```text
TODOAPP/
├── client/              # Frontend React client (Vite + Tailwind)
│   ├── src/
│   │   ├── components/  # Toast, TodoCard, TodoForm Drawer
│   │   ├── App.jsx      # Dashboard core logic
│   │   └── index.css    # Ambient light, stagger, and mask styles
│   ├── package.json
│   └── tailwind.config.js
├── server/              # Backend REST API server (Node + Express)
│   ├── config/          # MongoDB database connections
│   ├── controllers/     # CRUD routing handlers (Create, Read, Update, Delete)
│   ├── models/          # Mongoose Todo task schema
│   ├── routes/          # Express API route bindings
│   ├── index.js         # Express main entry point
│   ├── .env             # Port and Database environment configs
│   └── package.json
├── .gitignore           # Git ignore definitions (protecting secrets and modules)
└── README.md            # Project documentation
```

---

## ⚙️ Requirements & Configuration

Ensure you have [Node.js](https://nodejs.org/) installed and a local [MongoDB](https://www.mongodb.com/) instance active.

Configure the environment variables inside `server/.env`:
```env
PORT = 3000
DATABASE_URL = mongodb://127.0.0.1:27017/amanDataBase
```

---

## 🚀 Running the Workspace

### 1. Start the Backend API Server
In a terminal, navigate to the server directory, install dependencies, and start Node:
```powershell
cd server
npm install
npm run dev
```
*The server will start listening at `http://localhost:3000` and confirm its connection to MongoDB.*

### 2. Start the Frontend Client
In a separate terminal, navigate to the client directory, install dependencies, and start Vite:
```powershell
cd client
npm install
npm run dev
```
*The React client will launch at `http://localhost:5173`.*

---

## 🛡️ API Endpoints

The server exposes the following endpoints prefixed with `/api/v1`:

- **POST** `/createTodo` - Creates a new task.
  ```json
  {
    "title": "Build API",
    "description": "Design endpoints",
    "priority": "high",
    "dueDate": "2026-05-30T00:00:00.000Z",
    "tags": ["Code"]
  }
  ```
- **GET** `/getTodos` - Fetches all tasks.
- **GET** `/getTodos/:id` - Fetches a single task by ID.
- **PUT** `/updateTodos/:id` - Updates task properties and toggle completed states.
- **DELETE** `/deleteTodos/:id` - Removes a task from the database.

---

## 🧪 Production Build

To compile the React workspace for production deployment, run inside `client/`:
```bash
npm run build
```
This builds and minifies your code into the `client/dist/` directory.

---

## 💙 Author
Crafted by **Aman Sah** with pair-programming assistance from Antigravity AI.
