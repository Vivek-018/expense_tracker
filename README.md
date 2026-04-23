# Expense Tracker

A full-stack expense tracking application built with Next.js, MongoDB, and Tailwind CSS.

- **Live:** [https://expense-tracker-gamma-nine-68.vercel.app/]
- **Repo:** [https://github.com/Vivek-018/expense_tracker.git]

---

## Running Locally

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account (free tier works)

### Steps

```bash
# 1. Clone the repo
git clone [your-repo-url]
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Create .env in the project root
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expenses?retryWrites=true&w=majority

# 4. Start the dev server
npm run dev

# 5. Open http://localhost:3000
```

---

## Tech Stack

| Layer      | Choice                   |
|------------|--------------------------|
| Framework  | Next.js 16 (App Router)  |
| Language   | TypeScript               |
| Database   | MongoDB via Mongoose     |
| Validation | Zod                      |
| Styling    | Tailwind CSS             |
| Deployment | Vercel                   |

---

## Project Structure

```
src/
├── app/
│   ├── (tracker)/
│   │   ├── layout.tsx          # Shared nav layout
│   │   ├── page.tsx            # Dashboard (/)
│   │   └── analytics/
│   │       └── page.tsx        # Analytics (/analytics)
│   ├── api/
│   │   └── expenses/
│   │       ├── route.ts        # GET + POST /api/expenses
│   │       └── summary/
│   │           └── route.ts    # GET /api/expenses/summary
│   └── layout.tsx              # Root layout (fonts, dark bg)
├── components/
│   ├── ExpenseDashboard.tsx
│   ├── ExpenseForm.tsx
│   ├── ExpenseTable.tsx
│   ├── CategoryFilter.tsx
│   ├── SortToggle.tsx
│   ├── CategorySummaryTable.tsx
│   └── ui/
│       ├── NavLinks.tsx
│       ├── Spinner.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── mongodb.ts              # Singleton DB connection
│   ├── format.ts               # toDTO, formatAmount
│   └── validations.ts          # Zod schemas + shared limits
├── models/
│   └── Expense.ts              # Mongoose model
└── types/
    └── expense.ts              # Shared TypeScript types
```

---

## API

### POST /api/expenses

Creates a new expense entry.

**Request body:**

```json
{
  "clientId": "uuid-v4",
  "amount": 499.00,
  "category": "Food",
  "description": "Lunch at office",
  "date": "2025-04-23"
}
```

**Response `201`:**

```json
{
  "data": {
    "_id": "...",
    "amountPaise": 49900,
    "amountDisplay": "₹499.00",
    "category": "Food",
    "description": "Lunch at office",
    "date": "2025-04-23",
    "createdAt": "2025-04-23T10:00:00.000Z"
  }
}
```

If the same `clientId` is sent again (retry), the existing record is returned with `200` — no duplicate is created.

### GET /api/expenses

Returns a list of expenses.

| Query param | Description |
|-------------|-------------|
| `category`  | Filter by category (optional) |
| `sort`      | `date_desc` (newest first) or `date_asc` (oldest first). Defaults to `date_desc` |

### GET /api/expenses/summary

Returns total amount and entry count grouped by category, sorted by total descending. Used by the Analytics page.

---

## Key Design Decisions

**Money stored as integer paise**

`₹499.50` is stored as `49950` in MongoDB. Floating point arithmetic is unreliable for money — `0.1 + 0.2 !== 0.3` in JavaScript. Storing as integers and dividing only at display time avoids this entirely.

**Idempotent POST via clientId**

Each form instance generates a UUID (`clientId`) on mount. When a user submits, that ID goes with the request. If the same request arrives twice — due to a double-click, a retry, or a page reload mid-request — the API finds the existing record by `clientId` and returns it instead of creating a duplicate. A unique MongoDB index on `clientId` also handles the race condition where two requests arrive simultaneously.

**MongoDB connection singleton**

Next.js API routes run as serverless functions. Without caching the Mongoose connection on the global object, every request would open a new connection and exhaust the MongoDB connection pool quickly. The singleton pattern in `lib/mongodb.ts` reuses the connection across invocations.

**Validation in two places**

Zod schema on the API catches anything that reaches the server. The frontend mirrors the same limits (`AMOUNT_MAX`, `DESCRIPTION_MAX`) imported directly from `validations.ts` to give immediate feedback before a network request is made. The constants are defined once and shared — no duplication.

**Category list kept separate from filtered results**

The dropdown always shows all categories regardless of which filter is active. A separate `allCategories` state is populated from an unfiltered fetch on mount and extended via set union when new expenses are added. Without this, selecting "Food" would cause all other categories to disappear from the dropdown.

---

## Trade-offs Made

**No authentication**
The assignment specifies a single-user personal finance tool. Adding auth would have taken the majority of the time budget without adding value to what is being evaluated.

**Categories are hardcoded on the frontend**
A `categories` collection in MongoDB would be cleaner for a real product, but for this scope hardcoding the list in the component is simple and easy to change later.

**No pagination**
For a personal expense tracker the dataset stays small. Pagination adds UI and API complexity that is not justified here. If the list grows, a `limit`/`offset` query parameter can be added to the existing GET route without breaking changes.

**Analytics uses a separate API call**
`/api/expenses/summary` runs a MongoDB aggregation instead of computing totals from the already-fetched list on the client. This is slightly more than needed at this scale but shows the right pattern for when the dataset grows larger than what you would want to send over the wire.

---

## Deployment

The app is deployed on Vercel connected to a MongoDB Atlas free-tier cluster.

