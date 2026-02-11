# LeetCode Tracker

A personal, distraction-free app to build coding habits. Built with Next.js, Tailwind CSS, and Supabase.

## ✅ What's Included
- **Dashboard**: Track your mastery (Easy/Medium/Hard) and see problems due for review.
- **Strict Addition Form**: Add problems with mandatory "Remarks" (Approach, Mistakes, Insights).
- **Spaced Repetition**: Automatically flags problems for review based on confidence score (1-5).
- **Review Mode**: Filter problems by "Due Soon" and mark them as reviewed.
- **Authentication**: Secure login via Supabase.

---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fleetcode-tracker)

## 🔒 Is this Production Ready?
**Yes!** The app is designed with security and scalability in mind:
- **Data Isolation**: Row Level Security (RLS) ensures users can ONLY access their own data.
- **Secure Auth**: Uses Supabase's industry-standard authentication.
- **Performance**: Built on Next.js App Router for speed.

You can host this for free on Vercel + Supabase and share it with friends. See `deployment.md` for instructions.

---

## 🚀 Setup Guide (How to get it running)

### 1. Create a Supabase Project
1. Go to [database.new](https://database.new) and create a free project.
2. In your dashboard, find the **Project URL** and **anon public API key**.

### 2. Configure Environment Variables
1. In this folder, rename `.env.local.example` to `.env.local`.
   ```bash
   mv .env.local.example .env.local
   # On Windows Command Prompt: rename .env.local.example .env.local
   ```
2. Open `.env.local` and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Set Up the Database
1. Copy the code from `schema.sql`.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste the code and click **Run**.
   - This creates the `problems` table, sets up security policies (RLS), and defines the logic constraints.

### 4. Run the Project
1. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

---

## 🛠 Features Breakdown

### Auto-Revisit Logic
- **Confidence 1-2**: Revisit **Soon** (Red badge)
- **Confidence 3**: Revisit **Later** (Yellow badge)
- **Confidence 4-5**: **Don't Revisit** (Green badge)

The app enforces this logic both in the UI and the database to keep your review queue manageable.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v3 + Custom Design System (Radix UI logic)
- **Database**: PostgreSQL (Supabase)
- **Language**: JavaScript

Happy Coding! 🚀
