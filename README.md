# 🤖 AI Assistant Telegram Bot

A personal Telegram bot powered by GPT-3.5 that helps you plan your day, manage tasks, add events to Google Calendar, analyze activity, and more.

---


## 💬 About this project

The bot is currently designed for **a single user** and isn't yet deployed to a public server — it runs locally.  
There’s no external API for task storage, but the **PostgreSQL schema is clean and production-ready** (see the Prisma migration files).

> It’s not a full multi-user SaaS yet — but it’s a solid starting point for one.

If you plan to use it commercially (e.g., launch a paid subscription), I’d really appreciate a mention or credit. That’d mean a lot ❤️


---

## ✨ Features

- Responds to any messages (GPT)
- Add tasks via `/add_task`
- List all tasks with `/list_tasks`
- Analyze your day with `/analyze_day`
- Create events in Google Calendar via `/add_event`

---

## 🔐 Added Logic of Limitations

- 7-day trial period  
- 20 GPT requests per day  
- 10 tasks per day

---

## ⚙️ Tech Stack

NestJS, Telegraf, OpenAI, Prisma + PostgreSQL, Google Calendar API

---

## 🚀 Getting Started

```bash
npm install
cp .env.example .env
# Fill in the .env file
npx prisma generate
npx prisma migrate dev --name init
npm run start
```
---

## 🧪 What’s Next?

Soon I plan to return to this project to:

- Refactor and optimize core logic  
- Add image generation (DALL·E)  
- Add push notifications / reminders  
- Share access with friends for testing  
- Integrate Stripe & OAuth2 for subscriptions  
- Build optional web dashboard for management  

---

Feel free to fork it, use it, contribute — let’s make it even better together 💪

---

> 🛡️ This project is licensed under the MIT License.
> You’re free to use it for any purpose, including commercial use.
> If you monetize it (e.g. paid subscription), a credit/link to the original repo would be appreciated.
