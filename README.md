# DiploMate

DiploMate is a comprehensive platform for diploma students to access study materials, notes, microprojects, and capstone projects. It features a secure content delivery system, user authentication, wishlist management, and an admin dashboard for content management.

## Features

-   **Study Materials:** Access notes, question papers, and syllabus for various departments.
-   **Projects:** Browse and purchase microprojects and capstone projects.
-   **Secure Viewer:** PDF viewer with canvas rendering and drifting watermarks to prevent unauthorized distribution.
-   **User Accounts:** Sign up, login, manage wishlist, and view purchase history.
-   **Admin Dashboard:** Manage content, subjects, orders, users, coupons, and settings.
-   **Responsive Design:** Optimized for both desktop and mobile devices.

## Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **Styling:** Tailwind CSS, Shadcn UI
-   **State Management:** React Context, TanStack Query
-   **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)
-   **Routing:** React Router DOM

## Prerequisites

-   Node.js (v18 or higher)
-   npm (v9 or higher)
-   A Supabase project

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd DiploMate
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    ```

4.  **Database Setup:**

    Run the SQL migrations located in `supabase/migrations` in your Supabase project's SQL editor to set up the schema and RLS policies.

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Scripts

-   `npm run dev`: Start the development server.
-   `npm run build`: Build the application for production.
-   `npm run preview`: Preview the production build locally.
-   `npm run lint`: Run ESLint to check for code quality issues.
-   `npm run lint:fix`: Automatically fix linting issues.
-   `npm run format`: Format the code using Prettier.
-   `npm run typecheck`: Run TypeScript type checking.

## Architecture

### Routing

The application uses `react-router-dom` for client-side routing. Routes are defined in `src/routing/routes.tsx`.

-   **Public Routes:** Accessible to everyone (Home, Notes, Projects, etc.).
-   **Protected Routes:** Require user authentication (Dashboard, Wishlist). Wrapped in `<RequireAuth />`.
-   **Admin Routes:** Require admin role (Admin Dashboard, Content Management). Wrapped in `<RequireAdmin />`.

### Authentication & Authorization

Authentication is handled by Supabase Auth. The `AppContext` manages the user session and global state.

-   **Role-Based Access Control (RBAC):**
    -   User roles are stored in the `user_roles` table.
    -   The `hasRole` service (`src/services/roles.ts`) checks permissions using a Supabase RPC function or direct query.
    -   RLS policies in the database enforce data access security at the row level.

## Deployment

1.  **Build the project:**

    ```bash
    npm run build
    ```

2.  **Deploy:**

    Upload the `dist` folder to your hosting provider (e.g., Vercel, Netlify, GitHub Pages).

3.  **Custom Domain:**

    Configure your hosting provider's settings to point your custom domain to the deployed application. Ensure your Supabase project's "Site URL" and "Redirect URLs" are updated to match your production domain.
