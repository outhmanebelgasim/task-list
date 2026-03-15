# Task Manager

A full-stack task management application built with Laravel, Inertia.js, and React. The application allows authenticated users to organize their work through lists and tasks with full CRUD operations, filtering, search, and pagination.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Routes](#routes)
- [Troubleshooting](#troubleshooting)

---

## Overview

Task Manager is a single-page application that enables users to:

- Create and manage task lists
- Add, edit, delete, and complete tasks
- Filter tasks by status (completed / pending)
- Search tasks by title
- View dashboard statistics (total lists, total tasks, completed, pending)

All data is scoped to the authenticated user. No user can access another user's lists or tasks.

---

## Tech Stack

**Backend**

- PHP 8.2+
- Laravel 11
- Laravel Fortify (authentication)
- Inertia.js server-side adapter

**Frontend**

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui (component library)
- Lucide React (icons)
- Inertia.js client-side adapter
- Vite (asset bundler)

**Database**

- MySQL 8.0+

---

## Requirements

Make sure the following are installed on your machine before proceeding:

- PHP >= 8.2
- Composer >= 2.x
- Node.js >= 18.x
- npm >= 9.x
- MySQL >= 8.0
- Git

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/outhmanebelgasim/task-list.git
cd task-list
```

**2. Install PHP dependencies**

```bash
composer install
```

**3. Install Node dependencies**

```bash
npm install
```

---

## Configuration

**1. Create the environment file**

```bash
cp .env.example .env
```

**2. Generate the application key**

```bash
php artisan key:generate
```

**3. Configure the environment file**

Open `.env` and update the following values:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_list
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database
QUEUE_CONNECTION=database
```

> Important: The application uses SESSION_DRIVER=database which means sessions
> are stored in a MySQL table. You must run the session migration before the
> application will work correctly. If you skip this step, all users will appear
> as unauthenticated and the dashboard will show zero stats.

---

## Database Setup

Run all steps in order.

**1. Create the database**

Open MySQL and run:

```sql
CREATE DATABASE task_list;
```

**2. Generate the session table migration**

```bash
php artisan session:table
```

**3. Run all migrations**

```bash
php artisan migrate
```

This will create the following tables:

| Table | Description |
|---|---|
| `users` | Authenticated users |
| `sessions` | User sessions (required for SESSION_DRIVER=database) |
| `task_lists` | Task lists belonging to users |
| `tasks` | Tasks belonging to lists |
| `cache` | Laravel cache store |
| `jobs` | Queue jobs |
| `password_reset_tokens` | Password reset flow |

**4. (Optional) Seed the database**

```bash
php artisan db:seed
```

---

## Running the Application

You need two terminal windows open simultaneously.

**Terminal 1 — Laravel development server**

```bash
php artisan serve
```

The application will be available at `http://127.0.0.1:8000`.

**Terminal 2 — Vite asset bundler**

```bash
npm run dev
```

> Both processes must be running at the same time for the application to work correctly.

---

## Project Structure

```
app/
  Http/
    Controllers/
      DashboardController.php     # Dashboard statistics
      ListController.php          # CRUD operations for task lists
      TaskController.php          # CRUD operations for tasks
  Models/
    Task.php                      # Task model with list relationship
    TaskList.php                  # TaskList model with user relationship
    User.php                      # User model

database/
  migrations/                     # All database schema files

resources/
  js/
    pages/
      dashboard.tsx               # Dashboard overview page
      Lists/
        index.tsx                 # All lists page
      Tasks/
        index.tsx                 # All tasks page with search and filter
    components/
      ui/                         # shadcn/ui reusable components
    layouts/
      app-layout.tsx              # Main authenticated layout
    types/                        # TypeScript type definitions
    routes/                       # Wayfinder generated routes

routes/
  web.php                         # Application route definitions
  settings.php                    # Settings routes
```

---

## Features

**Authentication**

- Register, login, logout
- Email verification
- Password reset
- All routes protected by auth and verified middleware
- Sessions stored in database

**Lists**

- Create a list with a title and optional description
- Edit and delete lists
- Each list is scoped to the authenticated user

**Tasks**

- Create a task with a title, description, due date, and assigned list
- Mark tasks as completed or pending with a toggle
- Edit and delete tasks
- Filter by status: all, completed, pending
- Search tasks by title
- Server-side pagination

**Dashboard**

- Overview statistics: total lists, total tasks, completed tasks, pending tasks
- All stats are computed at the database level and scoped to the authenticated user
- Quick action links

---

## Routes

All routes require authentication via auth and verified middleware.

| Method | URI | Controller | Description |
|---|---|---|---|
| GET | `/dashboard` | DashboardController@index | Dashboard overview |
| GET | `/lists` | ListController@index | All lists |
| GET | `/lists/create` | ListController@create | Create list form |
| POST | `/lists` | ListController@store | Store new list |
| GET | `/lists/{list}/edit` | ListController@edit | Edit list form |
| PUT | `/lists/{list}` | ListController@update | Update list |
| DELETE | `/lists/{list}` | ListController@destroy | Delete list |
| GET | `/tasks` | TaskController@index | All tasks |
| GET | `/tasks/create` | TaskController@create | Create task form |
| POST | `/tasks` | TaskController@store | Store new task |
| GET | `/tasks/{task}/edit` | TaskController@edit | Edit task form |
| PUT | `/tasks/{task}` | TaskController@update | Update task |
| DELETE | `/tasks/{task}` | TaskController@destroy | Delete task |

---

## Troubleshooting

**Dashboard shows 0 for all stats**

This is caused by the session driver being set to database without the sessions
table existing. Run the following commands:

```bash
php artisan session:table
php artisan migrate
```

**500 Internal Server Error on dashboard**

This is likely caused by a duplicate import in the generated routes file. Open
`resources/js/routes/index.ts` and remove any duplicate import lines at the top
of the file. Then restart Vite:

```bash
npm run dev
```

**auth()->id() returns null in Tinker**

This is expected behavior. Tinker runs in CLI context with no HTTP session, so
there is no authenticated user. Test authentication logic through the browser
instead.

**General cache issues after configuration changes**

Run the following to clear all cached data:

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## Author

**Outhmane Belgasim**
GitHub: [outhmanebelgasim](https://github.com/outhmanebelgasim)

---

## License

This project is open-source and available under the [MIT License](LICENSE).
