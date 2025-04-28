# Personal Finance Tracker API

A Node.js (Express) backend application that enables users to manage their personal finances, set budgets, analyze spending behavior, and receive intelligent notifications.

## Tech Stack Used

- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT, OTP Simulation
- Cron Jobs: node-cron
- Others: dotenv, bcrypt, nodemon, Postman

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB instance (local or cloud)

### Installation

- git clone https://github.com/koteswararao-kots/Personal-Finance-Tracker-Api-System.git
- cd Personal-Finance-Tracker-Api-System
- npm install

### .env Configuration

Update your `.env` file:

- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
- JWT_SECRET=your_jwt_secret

### Run the Project

- npm start


### Core Functionalities & logic explanations

1. User Onboarding & Authentication

- Signup/Login: JWT-based authentication.

- Password Hashing: Secure bcrypt password storage.

- Role-Based Access: User roles ("User" and "Admin") are enforced.

- Audit Logging: Records each signup/login event.

- OTP Simulation: API to simulate email/SMS OTP verification (mocked).

2. Expense & Budget Management

- Expense CRUD:

  - Fields: amount, category, date, tags, notes.

- Endpoints: create, read, update, delete expenses.

- Budget Management:

  - Setup monthly budgets and category-wise spending limits.

- Auto-Categorization:

  - Simple pattern matching on tags/notes to assign categories automatically.

- Summaries:

  - Generates monthly reports comparing budgeted vs actual expenses.

3. User Score Generator

- Calculates a behavior-based score out of 100:

- Budget Adherence (30%):

  - Measures how closely the user stays within budget limits.

- Frequency of Usage (30%):

  - Measures how many days the user logged expenses.

- Expense Tracking Discipline (40%):

  - Measures completeness of expense entries (category + tags).

- Monthly Scores are saved per user and available via API.

4. Notification Engine

- Cron Job Scheduler (e.g., node-cron or manual trigger).

- Two Types of Notifications:

  - Overspending Alert:

- Detects if user overspent in any category.

- Inactivity Alert:

  - Detects users who haven't logged expenses for 5+ days.

- Mock Notification API:

  - Triggers a console log with structured JSON.

5. Transaction Ledger & Reversal

- Transaction Log:

  - Every create/edit/delete operation on expenses is logged.

- Reversal Endpoint:

- Allows users to reverse their last expense operation.

Safe Design:

Reversal restores/undoes without destructive database changes.

## Reversal Logic

- All expense operations (create, update, delete) are logged.
- The latest operation can be reversed via the `/reversal` endpoint.
- This avoids destructive changes and preserves historical integrity.

## API Documentation

- Use provided Postman collection or Swagger (if added).
- Endpoints: Auth, Expenses, Budgets, Score, Notifications, Reversal.

