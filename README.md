# approvalpaper_frontend

This project is a frontend application for managing approval papers, built with Vue 3 and Vite.

## Key Features

- **Document Management:** Create, view, and manage various types of approval documents.
- **Approval Workflows:** Streamlined processes for submitting, reviewing, and approving documents.
- **User Roles & Permissions:** Manage different user roles (e.g., submitter, approver, admin) with specific permissions.
- **Departmental Organization:** Filter and manage documents based on departments.
- **Data Visualization & Reporting:** Display data in tables and potentially offer reporting features.
- **Interactive Forms:** User-friendly forms for document creation and data input.
- **Navigation & UI:** Clear navigation and a user-friendly interface for ease of use.
- **Notifications:** (Potential) Alerts for pending actions or status updates on documents.

## Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: CSS (with `base.css` and `main.css`)
- **Linting**: [ESLint](https://eslint.org/)
- **IDE Recommendation**: [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (ensure Vetur is disabled)

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js) or Bun

### Installation

1.  Clone the repository:
    ```sh
    git clone <your-repository-url>
    cd approvalpaper_frontend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
    Alternatively, if you are using Bun:
    ```sh
    bun install
    ```

### Running the Development Server

To start the development server with hot-reloading:

```sh
npm run dev
```

Or with Bun:

```sh
bun run dev
```

The application will typically be available at `http://localhost:5173/` (Vite's default port, but check your terminal output).

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Type-checks, compiles, and minifies the project for production.
- `npm run lint`: Lints the codebase using ESLint.

(If using Bun, replace `npm run` with `bun run` for the above commands.)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default. This project uses `vue-tsc` for type checking via the command line. In editors, [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) is required to make the TypeScript language service aware of `.vue` types.

## Folder Structure Overview

```
approvalpaper_frontend/
├── public/                   # Static assets
├── src/
│   ├── App.vue               # Root Vue component
│   ├── assets/               # CSS, images, fonts
│   ├── components/           # Reusable Vue components
│   │   ├── data-table/       # Components related to data tables
│   │   ├── form/             # Form-related components
│   │   └── layout/           # Layout components (e.g., header, sidebar)
│   ├── composables/          # Vue 3 composables (e.g., useLoadingBar.ts)
│   ├── lib/                  # Libraries and configurations (e.g., axios.ts)
│   ├── main.ts               # Main entry point, initializes Vue app
│   ├── routers/              # Vue Router configuration (index.ts)
│   ├── stores/               # Pinia stores for state management
│   ├── types/                # TypeScript type definitions
│   └── views/                # Page-level Vue components
├── .env.example              # Example environment variables
├── eslint.config.ts          # ESLint configuration
├── index.html                # Main HTML file
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript compiler options
└── vite.config.ts            # Vite configuration
```

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for more details on customizing Vite.

## Contributing

(Optional: Add guidelines for contributing to the project here, e.g., branch naming conventions, pull request process, coding standards.)
