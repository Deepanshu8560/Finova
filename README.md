# Finova 🚀

Finova is a premium, modern financial dashboard designed for individuals and SaaS startup founders to understand their metrics instantly. Now featuring a system-wide dark mode, local data persistence, and a robust mock API layer for a seamless user experience.

[![React](https://img.shields.io/badge/React-18.x-blue?style=flat&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=flat&logo=react)](https://github.com/pmndrs/zustand)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat&logo=vite)](https://vitejs.dev)

![Finova Preview](./public/dashboard_mockup.png)

## 🛠 Key Features

- **Dark Mode 🌙**: Premium, high-contrast dark theme with system-wide integration and automatic persistence.
- **Mock API Layer ⚡**: Simulated backend interactions with realistic latency and robust error handling.
- **Data Persistence 💾**: All your transactions and theme preferences are saved locally using `localStorage`.
- **Financial Insights 📊**: Data-driven analysis of spending habits, top categories, and monthly trends.
- **Admin/Viewer Roles 🛡️**: Toggle between permission levels to simulate different user experiences.
- **Beautiful Visualizations**: Dynamic charts powered by Recharts (Monthly Trends, Spending Velocity).

## 🤖 Technical Highlights

- **State Management**: Scalable global state using **Zustand** with the `persist` middleware for an always-loaded experience.
- **Styling**: Modern UI built with **Tailwind CSS v4**, featuring glassmorphism, fluid animations, and a rich color palette.
- **Mock API Service**: A dedicated `api.js` handler that mimics real network requests, allowing for beautiful loading states and predictable data flow.

## 🚀 Setup & Installation

Follow these steps to run the Finova dashboard locally:

**1. Clone the repository and install dependencies:**
```bash
git clone https://github.com/yourusername/finova.git
cd finova
npm install
```

**2. Configure Environment Variables (Optional):**

Create a `.env.local` file in the root of the project. 

*(Note: Finova includes a fully-functional "Mock Mode" that works out-of-the-box without any real credentials!)*

```env
# AI Provider (Optional)
VITE_GROQ_API_KEY="your_groq_api_key_here"

# Firebase Config (Optional)
VITE_FIREBASE_API_KEY="your_api_key"
...
```

**3. Start the Vite development server:**
```bash
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## 📸 Screenshots

| Dashboard Overview | Financial Insights |
|:---:|:---:|
| ![Dashboard Placeholder](https://via.placeholder.com/600x400/0a0f1e/10b981?text=Dashboard) | ![Insights Placeholder](https://via.placeholder.com/600x400/0a0f1e/10b981?text=Insights) |

## 📜 License

[MIT](LICENSE)
