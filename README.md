# InsightAI 🚀

InsightAI is a professional-grade dashboard designed for SaaS startup founders to understand their metrics instantly using AI-augmented, natural language queries.

[![React](https://img.shields.io/badge/React-18.x-blue?style=flat&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20&%20Firestore-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)
[![groq API](https://img.shields.io/badge/groq-fast%20inference-black?style=flat&logo=x)](https://groq.com)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat&logo=vite)](https://vitejs.dev)

![InsightAI Preview](./public/dashboard_mockup.png)

*Live Demo: [https://insightai.app](#)*

## 🛠 Features

- **No SQL Required**: Just ask "What drove churn last month?" or "How many active users do we have?"
- **Real-Time KPI Tracking**: Immediate insights on MRR, ARR, DAU, and Churn Rate.
- **Beautiful Visualizations**: Dynamic charts powered by Recharts (Revenue Growth, Signups, Acquisition).
- **Graceful Degradation**: Full local mock-mode fallback if API keys are absent.

## 🤖 How the AI Layer Works

Our unique AI implementation allows founders to chat directly with their business metrics:
1. **Context Structuring**: When a user asks a question, the dashboard transparently collates current KPI metrics, 6-month revenue trends, and top user data into an optimized, serialized JSON context package.
2. **System Persona Prompting**: The query is routed to the **groq** API, prepended with a strict system prompt that instructs the AI to behave as an expert, concise startup data analyst.
3. **Streamlined UI/UX**: The response is presented using a smooth typewriter effect inside a dedicated AI response card, with integrated latency metrics and inline error fallback handling to ensure a robust user experience.

## 🚀 Setup & Installation

Follow these steps to run the InsightAI dashboard locally:

**1. Clone the repository and install dependencies:**
```bash
git clone https://github.com/yourusername/insight-ai.git
cd insight-ai
npm install
```

**2. Configure Environment Variables:**

Create a `.env.local` file in the root of the project with the following exact names. 

*(Note: If you leave these blank, the app will gracefully default to a fully-functional "Mock Mode" without needing real credentials!)*

```env
# AI Provider (Required for real AI responses)
VITE_GROQ_API_KEY="your_groq_api_key_here"

# Firebase Config (Required for real database and auth)
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

**3. Start the Vite development server:**
```bash
npm run dev
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## 📸 Screenshots

| Landing Page | Metric Analysis |
|:---:|:---:|
| ![Landing Page Placeholder](https://via.placeholder.com/600x400/0a0f1e/10b981?text=Landing+Page) | ![Metric Analysis Placeholder](https://via.placeholder.com/600x400/0a0f1e/10b981?text=Metric+Analysis) |

## 📜 License

[MIT](LICENSE)
