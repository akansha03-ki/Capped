<<<<<<< HEAD
<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Capped


# Expense Tracking for Students Who Are Trying Their Best

Capped is a mobile-first web application that helps students track daily spending, split bills with friends, visualise their financial habits, and get nudged (or roasted) by an AI financial advisor. Built around the idea that budgeting shouldn't feel like a chore — it should feel like the app actually gets you.

---

## Features

**Authentication**
Three entry points: Log In (returning user with existing data), Sign Up (fresh start with onboarding), or Skip & Continue (jump in with demo data). New users go through a short onboarding questionnaire called *Spill Your Spend* to set their monthly budget and flag their spending weaknesses.

**Dashboard**
Live net balance, total expenses, and total income. Recent transactions displayed with category, title, payment mode, and amount. Scroll down to view up to 30 past transactions, then hop to the Calendar.

**Add Transaction**
Pick a category, enter a title (or auto-fill from category), log the amount. Net balance and charts update immediately.

**Split Bill**
Split any expense equally or manually among multiple people. Feeds into Reminder notifications so you never forget who owes you.

**Expenditure Charts**
- Weekly: stacked bar chart — red for expenses, green for income
- Monthly: line chart with smart date binning

**Notifications**
- *Roast* — spent on your declared weakness category again? The app noticed.
- *Motivation* — spending less than last week earns you genuine praise.
- *Reminder* — pulls from split bill history to remind you who still hasn't paid up.

**Calendar**
Full month grid with indicators on days that have transactions. Click any date to see every transaction from that day. Navigate between months. Daily, weekly, and monthly averages displayed below.

**AI Chatbot**
Powered by Google Gemini. Acts as a sarcastic but genuinely helpful financial advisor. Yap at it, ask for budget advice, or just complain about your expenses.

**Theming**
Default light palette: Brown `#DDB892`, Sage Green `#9DC183`, Pastel Pink `#FFC5D3`. Dark mode with soft, eye-friendly blacks. 10 colour palettes to choose from — applied globally across the entire app.

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Date Logic | date-fns |
| State Management | React Context API |
| Persistence | localStorage |
| AI Chatbot | Google Gemini via Vercel AI SDK |
| Deployment | Firebase Hosting |

---

## Setup Instructions

**1. Clone the repository**
```bash
git clone https://github.com/your-username/capped.git
cd capped
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your environment file**

Create a `.env.local` file in the root of the project:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

> The app works completely without the API key — only the chatbot requires it.

**4. Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**5. Deploy to Firebase** *(optional)*
```bash
npm run build
firebase login
firebase init
firebase deploy
```

---

## Screenshots

> *Screenshots will be added after deployment.*

| Screen | Preview |
|---|---|
| Authentication | coming soon |
| Spill Your Spend | coming soon |
| Dashboard | coming soon |
| Expenditure Charts | coming soon |
| Split Bill | coming soon |
| Calendar | coming soon |
| Notifications | coming soon |
| Theme Selector | coming soon |

---

## Live Link

> [capped.web.app]()
---

Built with questionable financial decisions and a lot of love.
>>>>>>> b9577a0dc18c8e75f05266505cda04f2d84b2392
