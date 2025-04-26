# Design Notes – Personal Finance Tracker

## Architecture Overview

- MVC Pattern: Controllers handle logic, models define schemas, and routes expose API.
- Modularity: Separated features (auth, expenses, budgets, scores, notifications) into modules.
- Jobs: Scheduled jobs are abstracted into `jobs/` and run via cron.

## Database Design (MongoDB)

## schemas
### User 

```json
{
  _id,
  name,
  email,
  password (hashed),
  role: "user" | "admin",
  createdAt,
  updatedAt
}
```

### Expense

```json
{
  _id,
  userId,
  amount,
  category,
  date,
  tags,
  notes
}
```

### Budget

```json
{
  _id,
  userId,
  month: "YYYY-MM",
  total,
  categories: [{ name, limit }]
}
```

### TransactionLog (Ledger)

```json
{
  _id,
  userId,
  operation: "create" | "update" | "delete",
  expenseData: {...},
  timestamp
}
```

## Behavior Score Logic

 **Total Score**: 100

| Metric                   | Weight |
|--------------------------|--------|
| Budget Adherence         | 30%    |
| Frequency of Usage       | 30%    |
| Expense Tracking Discipline | 40% |

### Budget Adherence

- How close is the user’s spending to their planned category budgets?

# Calculation Steps:

- For each category in the budget:

  - Find how much they actually spent (actualAmount).
  - Compare it to their limit (budgetedAmount).
  - Adherence% for a category = (actualAmount / budgetedAmount)× 100

- But cap it at 100% (even if overspending).

- Average adherence across all categories.

- Finally, scale it down to 30% because budget adherence is only 30% weight.

# Example: 
        Category | Budgeted | Actual | Adherence
        Food     | 2000     | 1800   | 90%
        Travel   | 1000     | 1200   | 100% (overspent capped)

- Average Adherence = (90 + 100) / 2 = 95% 
- Scaled for final score = 95 × 0.3 = 28.5 points (out of 30)

### Frequency of Usage
- How often did the user log expenses during the month?

# Calculation Steps:
- Find how many different days they logged expenses (activeDays).

- Calculate:
    Frequency usage % = (activeDays / totalDaysInMonth) × 100

- Scale it to 30%.

# Example:

- 10 active days in a 30-day month.

- Raw frequency = (10/30)×100=33.33%

- Scaled = 33.33 × 0.3 = 10 points (out of 30)



### Expense Discipline
- Did the user fill expenses properly with category and tags?

# Calculation Steps:
- Total number of expenses logged = totalExpenses

- How many expenses are well-tracked (have category + at least one tag) = trackedExpenses

Calculate:

- Expense discipline % =(trackedExpenses/totalExpenses)×100
- Scale it to 40%.

# Example:
- 50 total expenses.
- 40 well-tracked.
- Raw discipline = (40/50)×100=80%
- Scaled = 80 × 0.4 = 32 points (out of 40)



## Finally:

 - finalScore = budgetAdherence + frequencyUsage + expenseDiscipline
 - If the score somehow exceeds 100 (unlikely), you cap it at 100.


##  Testing
- Postman collection for all endpoints.
