# 🐾 PetLove

**PetLove** is a responsive web application designed to help people find pets, explore adoption listings, and discover useful information about animal care.

Users can browse available pets, search and filter listings, save their favorite animals, view detailed information, and manage their personal profiles.

🔗 **Live Demo:** https://petlove-orcin-nine.vercel.app/

---

## ✨ Features

- **User Authentication** — registration, login, logout, and session restoration.
- **Protected Routes** — authenticated access to profile and pet management pages.
- **Pet Listings** — browse animals with photos and detailed information.
- **Search & Filtering** — search and filter available listings.
- **Sorting & Pagination** — organize listings and navigate through results.
- **Favorites** — save and manage favorite pets.
- **Pet Details** — view additional information about animals.
- **User Profile** — manage personal information and uploaded pets.
- **Pet Management** — add and remove pets from a personal profile.
- **Image Upload** — upload pet photos using Cloudinary.
- **News** — browse and search pet-related articles.
- **Our Friends** — explore partner organizations.
- **Responsive Design** — mobile, tablet, and desktop layouts.
- **Loading States** — global loading indicator for asynchronous requests.
- **Error Handling** — custom 404 page, error boundary, and toast notifications.

## 🛠️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- CSS Modules
- Redux Toolkit
- React Redux
- TanStack Query

### Forms & Validation

- React Hook Form
- Yup
- @hookform/resolvers

### API & Utilities

- Axios
- React Hot Toast
- React Select
- React Paginate
- React Icons
- Cloudinary

### Backend

- External REST API
- Next.js API routes
- HTTP-only cookie-based authentication

## 🏗️ Architecture

The application uses the Next.js App Router and separates routing, reusable UI components, API requests, and state management.

- **App Router** — file-based routing and layouts.
- **Reusable Components** — shared navigation, forms, cards, modals, and loaders.
- **API Layer** — HTTP requests using Axios.
- **Redux Toolkit** — authentication and global client state.
- **TanStack Query** — server-state management, caching, queries, and mutations.
- **React Hook Form & Yup** — form handling and validation.
- **CSS Modules** — component-scoped responsive styling.
- **Next.js Image** — image rendering and optimization.
- **Error Boundaries** — error handling and retry functionality.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/TetianaMendel/petlove.git
```

**2. Navigate to the project directory:**

```bash
cd petlove
```

**3. Install dependencies:**

```bash
npm install
```

**4. Configure environment variables:**

Create a `.env.local` file in the project root and configure the environment variables required by the application.

Keep private credentials out of version control.

**5. Start the development server:**

```bash
npm run dev
```

**6. Open the application:**

[http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

## 📱 Responsive Design

PetLove supports responsive layouts for mobile, tablet, and desktop devices.

The interface follows the provided Figma design.

## 🔐 Authentication

The application uses HTTP-only cookies for session management and Redux Toolkit for client-side authentication state.

Authentication is restored through `/api/auth/current`.

Private routes such as `/profile` and `/add-pet` are accessible only to authenticated users.

## 👩‍💻 Author

**Tetiana Mendel**

[GitHub](https://github.com/TetianaMendel)

## 🎨 Design

[Figma — PetLove](https://www.figma.com/design/RGEwWRPHsF41Vcqibgd2NN/)
