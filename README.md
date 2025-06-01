
# RentEase Manager

A modern and intuitive equipment rental management system built with React, TypeScript, Tailwind CSS, and Vite.

## 🌐 Live Demo

Deployed at: [https://rent-ease-manager.vercel.app](https://rent-ease-manager.vercel.app)

## 📦 Repository

GitHub: [https://github.com/IsseiDxD0812/rent-ease-manager](https://github.com/IsseiDxD0812/rent-ease-manager)

---

## 🚀 Setup Instructions

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (preferably via [nvm](https://github.com/nvm-sh/nvm))
- **npm** (comes with Node.js)

### 2. Clone the Repository

```bash
git clone https://github.com/IsseiDxD0812/rent-ease-manager.git
cd rent-ease-manager
````

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

This starts the Vite development server with hot module reloading. Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🏗️ Tech Stack

* **Vite** – lightning-fast build tool
* **React** – component-based UI library
* **TypeScript** – static typing for JavaScript
* **Tailwind CSS** – utility-first CSS framework
* **shadcn/ui** – accessible and customizable UI components

---

## 📁 Project Structure Overview

```bash
rent-ease-manager/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components/routes
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and helpers
│   ├── styles/          # Tailwind and global styles
│   └── main.tsx         # App entry point
├── index.html
├── package.json
└── vite.config.ts
```




## 🧠 Technical Decisions

* **Vite** was chosen for its fast startup and HMR performance.
* **shadcn/ui** was integrated for rapid UI development with accessibility in mind.
* **TypeScript** helps catch bugs early and makes the codebase more maintainable.
* **Tailwind CSS** provides utility classes for consistent styling without custom CSS bloat.

---

## ❗ Known Issues

 **🔐 Hardcoded Authentication**

   * Issue: Login credentials are hardcoded in the frontend code.
   * Impact: High – Security vulnerability; passwords are exposed in client-side code.


 **🧾 No Real Authentication/Authorization**

   * Issue: Role-based access is enforced only via frontend checks.
   * Impact: High – Can be bypassed by manipulating localStorage.


 **🔄 No Real-time Features**

   * Issue: Notifications and data updates are not real-time.
   * Impact: Reduces responsiveness and user collaboration.

 **🧭 Feedback System Navigation Missing**

   * Issue: The feedback page exists but there’s no link to it in MainLayout.
   * Impact: Poor discoverability of the feedback functionality.

 **🗄️ No Backend/Database Integration**

   * Issue: All data is stored in localStorage, which leads to:
      * Data loss when browser storage is cleared.
      * No synchronization between different users or sessions.
      * No cross-device data persistence.
      * Limited scalability due to local storage size limits.

---
