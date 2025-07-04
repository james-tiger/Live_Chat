# Rapid Talk Sphere

Rapid Talk Sphere is a modern, real-time chat application built with a powerful and scalable tech stack. It provides a seamless and engaging user experience for real-time messaging.

## Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [📜 Scripts](#-scripts)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

- **Real-time Messaging**: Instantaneous message delivery and updates using Supabase real-time subscriptions.
- **User Authentication**: Secure user sign-up and sign-in functionality handled by Supabase Auth.
- **User Profiles**: Users can set their display name, bio, and upload an avatar.
- **Online Status**: See which users are currently online.
- **Typing Indicators**: Know when another user is typing a message.
- **Modern UI**: A beautiful and responsive user interface built with shadcn/ui, Radix UI, and Tailwind CSS.
- **Form Management**: Robust and efficient forms powered by React Hook Form.
- **Client-Side Caching**: Improved performance and UX with TanStack Query.

## 📂 Folder Structure

The project follows a standard structure for React applications, with all source code located in the `src` directory. Key directories include:

```
src
├── components    # Reusable UI components
│   └── ui        # Components from shadcn/ui
├── hooks         # Custom React hooks
├── integrations  # Supabase client and types
├── pages         # Top-level page components
└── ...
```

## 📜 Scripts

The following scripts are available in the `package.json`:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase for errors.
- `npm run preview`: Serves the production build locally for preview.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management/Caching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm
- A Supabase account and project

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/Live_Chat.git
    cd Live_Chat
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Supabase environment variables:**

    Create a `.env.local` file in the root of your project and add your Supabase project URL and anon key:

    ```
    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

    You can find these in your Supabase project settings under "API".

4.  **Set up Supabase database schema:**

    You will need to set up the following tables in your Supabase database:

    -   `rooms`
    -   `messages`
    -   `profiles`
    -   `typing_indicators`

    You can use the SQL editor in the Supabase dashboard to create these tables based on the interfaces found in `src/hooks/useRealTimeChat.tsx`.

5.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:5173](http://localhost:5173) (or your default dev server port) in your browser to see the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
