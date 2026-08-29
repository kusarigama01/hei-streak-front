# HEI Streak — Frontend

Frontend of the Exam Hub QCM exam management platform, built for HEI (Haute École d'Informatique, Antananarivo).

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- The [HEI Streak backend](https://github.com/kusarigama01/hei-streak-back) running locally (see its own README for setup)

## Installation

```
git clone https://github.com/kusarigama01/hei-streak-front.git
cd hei-streak-front
npm install
```

## Configuration

The API base URL is set in `src/api/client.js`:

```js
const BASE_URL = "http://localhost:4000/api";
```

Adjust this if your backend runs on a different port.

## Running the project

```
npm run dev
```

The app will be available at `http://localhost:5173`.

Make sure the backend (and its PostgreSQL container) is running first — otherwise login and all data-dependent pages will fail to load.

## Test accounts

| Role  | Email                  | Password   |
|-------|-------------------------|------------|
| Admin | admin@examhub.local     | Admin123!  |

No student test account exists yet — student accounts must currently be created by an admin through the Student Manager, but this feature depends on a backend fix that is not yet merged (see Known issues below).

## Project structure

```
src/
  api/          → centralized fetch client
  components/   → shared reusable components (ProfileCard, ProtectedRoute...)
  context/      → auth context (token, role)
  pages/        → route-level pages (Login, AdminDashboard, StudentDashboard, forms...)
```

## Routing

- `/login` — shared login page
- `/admin` — admin space (Profile, Student Manager, Courses, Exams), role-protected
- `/student` — student space (Profile, Code, Exams), role-protected

Note: exam-taking, results, and admin sub-views (questions editor, exam results) are handled via internal component state rather than dedicated routes, for time reasons during development. Direct URL navigation to a sub-view (e.g. a specific exam) is therefore not supported — navigation happens through the sidebar and in-app buttons only.

## Known issues / current state

- Student, course, and exam creation currently run on local mock data in the admin dashboard. Only the student list is fetched from the real API on load.
- A backend routing bug (routes registered after `app.listen()`) currently causes `/api/students`, `/api/courses`, and `/api/exams` to return 404. Full API wiring is pending this fix.
- The "Code" exam type is a visual placeholder only ("Coming soon") — only QCM exams are functional, as required by the subject.