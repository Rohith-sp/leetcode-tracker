# 🧠 LeetCode Tracker

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fleetcode-tracker)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A specialized Spaced Repetition System (SRS) for LeetCode problems. Built to help developers master algorithms through structured review, not random practice.

## ✨ Key Features

### 1. 📊 Smart Dashboard
- **At-a-glance Stats**: Track total problems solved, breakdown by difficulty (Easy/Med/Hard), and current mastery level.
- **Due Soon Queue**: Automatically surfaces problems that need review based on your forgetting curve.

### 2. 📝 Strict Input Flow
- **Mandatory Reflection**: You cannot just paste a link. You *must* document:
  - **Approach**: How you solved it.
  - **Mistake/Confusion**: What tripped you up? (Crucial for learning).
  - **Key Insight**: The "Aha!" moment.

### 3. 🧠 Spaced Repetition Logic
The app automates your revision schedule based on your self-rated **Confidence Score (1-5)**:
- **1-2 (Need Practice)**: Revisit **Soon** (Red badge).
- **3 (Getting There)**: Revisit **Later** (Yellow badge).
- **4-5 (Mastered)**: Marked as **Done** (Green badge).

### 4. 🔒 Enterprise-Grade Auth
- **Secure Login**: Powered by Supabase Auth (Email/Password).
- **Data Isolation**: Row Level Security (RLS) ensures you see *only* your data.
- **Multi-Device**: Log in from anywhere to check your streak.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + Custom Design System
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev)

---

## 🚀 Deployment Guide
Want to use this yourself? It's free and takes < 5 minutes.

### 1. Clone & Deploy
Click the **"Deploy with Vercel"** button above. Vercel will create a copy of this repo in your GitHub and deploy it.

### 2. Connect Database
1. Create a free project at [database.new](https://database.new) (Supabase).
2. Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Add these as Environment Variables in Vercel.

### 3. Run SQL Schema
Copy the code from [`schema.sql`](./schema.sql) and run it in your Supabase SQL Editor. This sets up the tables and security policies.

### 4. Auth Config
In Supabase -> Authentication -> URL Configuration, set your Site URL to your Vercel domain (e.g., `https://your-app.vercel.app`).

---

## 💻 Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/leetcode-tracker.git
   cd leetcode-tracker
   ```

2. **Install modules**
   ```bash
   npm install
   ```

3. **Set up Env**
   Rename `.env.local.example` to `.env.local` and add your Supabase keys.

4. **Run Dev Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## � License
This project is open source and available under the [MIT License](LICENSE).
