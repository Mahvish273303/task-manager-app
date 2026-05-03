## Task Manager Application (MERN)

A production-ready **Task Manager** application built with **React (Vite)**, **Node.js + Express**, **MongoDB (Mongoose)**, **TailwindCSS**, following a clean **MVC architecture**.

### Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Axios
- **Backend**: Node.js, Express, Mongoose, MVC pattern
- **Database**: MongoDB

---

## Features

- **Create Task** (with title, description, due date, status, remarks, audit fields)
- **View All Tasks**
- **Update Task**
- **Delete Task**
- **Search Tasks** by title (and optionally filter by status)
- **Filter Tasks** by status
- **Timestamps & Audit Fields**: `createdOn`, `updatedOn`, `createdBy`, `updatedBy`
- **REST API** organized with controllers, models, and routes
## Application Preview

![Task Manager Dashboard](screenshots/dashboard.png)

This screenshot shows the main dashboard where users can create, update, delete, and search tasks.
---

## Backend Structure

`backend/`

- `server.js` - Express app bootstrap, middleware, and route mounting
- `config/db.js` - PostgreSQL connection pool configuration
- `routes/taskRoutes.js` - Task API routes
- `controllers/taskController.js` - Request handling and validation
- `models/taskModel.js` - Database access (CRUD + search)

### API Endpoints

Base URL: `http://localhost:5000/api`

- **POST** `/tasks` → create task
- **GET** `/tasks` → list tasks (optional `?status=` filter)
- **GET** `/tasks/:id` → get single task
- **PUT** `/tasks/:id` → update task
- **DELETE** `/tasks/:id` → delete task
- **GET** `/tasks/search?q={query}&status={status?}` → search tasks by title and optional status

Status values: `Pending`, `In Progress`, `Completed`

---

## Data Model (MongoDB / Mongoose)

### Collection: `tasks`

- `title` (`String`, required)
- `description` (`String`, optional)
- `dueDate` (`Date`, optional)
- `status` (`String`, enum: `Pending`, `In Progress`, `Completed`, default `Pending`)
- `remarks` (`String`, optional)
- `createdBy` (`String`, required)
- `updatedBy` (`String`, required)
- `createdAt` (`Date`, auto-managed by Mongoose timestamps)
- `updatedAt` (`Date`, auto-managed by Mongoose timestamps)

### ER Diagram Description

- **Entity**: `Task`
  - Attributes: `id`, `title`, `description`, `dueDate`, `status`, `remarks`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- **Relationships**:
  - In this simple version, `Task` is a standalone entity (no references).
  - In a multi-user system, `createdBy` / `updatedBy` could reference a `users` collection.

Visually:

- `Task (id)` is the document identifier (MongoDB `_id`, exposed as `id` in API responses).
- All other attributes are embedded fields in the document.

### Data Dictionary

| Field        | Type    | Nullable | Description                                                |
|-------------|---------|----------|------------------------------------------------------------|
| `id`        | String  | No       | Unique identifier for each task (MongoDB ObjectId)        |
| `title`     | String  | No       | Short task title                                           |
| `description` | String| Yes      | Detailed description of the task                           |
| `dueDate`   | Date    | Yes      | When the task is expected to be completed                  |
| `status`    | String  | No       | Task status: `Pending`, `In Progress`, `Completed`         |
| `remarks`   | String  | Yes      | Additional notes or comments                               |
| `createdBy` | String  | No       | Who created the task (username or identifier)              |
| `updatedBy` | String  | No       | Who last updated the task                                  |
| `createdAt` | Date    | No       | When the task was created                                  |
| `updatedAt` | Date    | No       | When the task was last updated                             |

---

## Frontend Structure

`frontend/src/`

- `main.jsx` - React entry point
- `index.css` - TailwindCSS import and base styles

**Components**

- `components/TaskForm.jsx` - Create / edit task form
- `components/TaskList.jsx` - Renders list of tasks
- `components/TaskCard.jsx` - Individual task summary card
- `components/SearchBar.jsx` - Search and status filter UI

**Pages**

- `pages/Dashboard.jsx` - Main page combining form, search, and list

**Services**

- `services/api.js` - Axios API client for all task endpoints

---

## Environment Variables

See `.env.example` at the project root.

Backend:

- `PORT` - Port for Express server (default `5000`)
- `MONGO_URI` - MongoDB connection string (e.g. `mongodb://localhost:27017/task_manager_db`)
- `JWT_SECRET` - Secret used to sign authentication tokens

Frontend:

- `VITE_API_URL` - API base URL (e.g. `http://localhost:5000/api`)

Create a `.env` file in the project root (or inside `backend/` and `frontend/` as needed) based on `.env.example`.

---

## Setup Instructions

### 1. Clone / Open the Project

From your terminal:

```bash
cd c:\Projects\Task_manager_app
```

### 2. Database Setup (MongoDB)

1. Make sure MongoDB is installed and running locally (or use a hosted MongoDB instance).
2. The default connection string used is:

```bash
MONGO_URI=mongodb://localhost:27017/task_manager_db
```

3. The database and `tasks` collection will be created automatically on first write.

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `MONGO_URI` if needed to match your MongoDB setup.

> On Windows PowerShell, you can copy via:
> `Copy-Item .env.example .env`

---

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

- The API will run on `http://localhost:5000`.
- Base path for tasks: `http://localhost:5000/api`.

### Example cURL Calls

Create a task:

```bash
curl -X POST http://localhost:5000/api/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Sample Task\",\"description\":\"Demo\",\"status\":\"Pending\",\"createdBy\":\"cli\"}"
```

List all tasks:

```bash
curl http://localhost:5000/api/tasks
```

Search by title:

```bash
curl "http://localhost:5000/api/tasks/search?q=Sample"
```

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

- The app will run on `http://localhost:5173`.
- Make sure `VITE_API_URL` points to your backend API URL.

---

## MVC Overview

- **Model (`TaskModel`)**
  - Encapsulates all database access.
  - Exposes methods like `getAll`, `getById`, `create`, `update`, `delete`, `search`.
- **Controller (`taskController`)**
  - Validates inputs and coordinates between HTTP layer and model.
  - Maps request to model calls and shapes the response.
- **Routes (`taskRoutes`)**
  - Defines RESTful endpoints and maps them to controller methods.
- **View (React frontend)**
  - Consumes the REST API and presents a clean UI with TailwindCSS.

---

## Production Considerations

- Use **environment variables** for all secrets and database credentials.
- Add proper **logging** / monitoring (e.g. Winston + log aggregation).
- Configure **CORS** for allowed origins only.
- Add **rate limiting** and **authentication** for multi-user scenarios.
- Use **database migrations** (e.g. with `knex`, `sequelize`, or `node-pg-migrate`) in a real production environment.

