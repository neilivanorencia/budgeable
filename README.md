<div align="center">
  <img src="src/app/icon.svg" alt="Budgeable Logo" width="100" height="100" />
  <h1 align="center">Budgeable</h1>
  <p align="center">Track expenses and budget activities</p>
</div>

<div align="center">
  <br />
  <img src="public/website-preview.png" alt="Budgeable Preview" />
  <br /><br />
  <div>
    <img
      alt="Clerk"
      src="https://img.shields.io/badge/Clerk-%236C47FF?style=flat&logo=clerk"
    />
    <img
      alt="Next.js"
      src="https://img.shields.io/badge/Next.js-%23000000?logo=nextdotjs&logoColor=white"
    />
    <img
      alt="React"
      src="https://img.shields.io/badge/React-%230088CC?logo=react&logoColor=white"
    />
    <img
      alt="shadcn/ui"
      src="https://img.shields.io/badge/shadcn%2Fui-%23000000?logo=shadcnui&logoColor=white"
    />
    <img
      alt="Tailwind CSS"
      src="https://img.shields.io/badge/Tailwind%20CSS-%2306B6D4?logo=tailwindcss&logoColor=white"
    />
    <img
      alt="Typescript"
      src="https://img.shields.io/badge/Typescript-%233178C6?logo=typescript&logoColor=white"
    />
  </div>
</div>
<br />

Budgeable is a personal finance and budgeting web application designed to help users track their expenses, manage budgets, and gain insights into their spending habits. It has a simple, modern design with easy-to-understand data visualizations and integrates with Plaid for bank account synchronization, so that financial data is always up-to-date and easily accessible.

## ✨ Features

- **Dashboard Overview** - Offers a concise, at-a-glance overview of the user's financial situation through an intuitive dashboard. It displays key metrics such as total budget, expenses incurred, and remaining funds for user-defined periods. The dashboard features interactive charts, including quantitative charts (such as area chart, bar chart, and line chart) to visualize transaction trends over time and circular charts (such as pie chart, radar chart, and radial chart) that breaks down spending by various categories, enabling users to filter the data by specific accounts and custom date ranges for personalized financial analysis.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/ArU9rDf.png" alt="Budgeable" />
</details>

- **Transaction Management** - Features a sortable and filterable table, allowing users to organize their financial activities and transactions by date, category, payee, amount, and account. It also supports manual transaction entry, bulk import capabilities, and allows users to select and delete multiple transactions efficiently, with pagination for easy navigation through extensive transaction lists.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/D5r4KQu.png" alt="Budgeable" />
</details>

- **CSV Transaction Import** - Enables users to import transactions in CSV files. During the import process, users have the option to map columns in their CSV file (date, payee, amount, etc.) to respective fields in the application. This feature gives users flexibility to import data from different sources and prevents errors in data entry by giving them options to skip or properly map each column before confirming the import.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/D5r4KQu.png" alt="Budgeable" />
</details>

- **Account Organization** - Users can define and manage various financial accounts, such as checking, savings, and credit cards. Users can easily add new accounts, filter through existing ones by name, and delete accounts as needed. This allows for clear segregation and tracking of funds across different financial instruments.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/MPQbiX9.png" alt="Budgeable" />
</details>

- **Category Organization** - Users can define and manage custom spending categories (e.g., Groceries, Utilities, Entertainment). Similar to accounts, users can add new categories, filter them by name, and delete them. This structured categorization helps users understand their spending patterns and budget more effectively.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/7n3d6iS.png" alt="Budgeable" />
</details>

- **Multi-Currency Support** - Lets users select their preferred display and storage currency from a comprehensive list of world currencies in the Settings page. When a new currency is chosen, all existing amounts are converted at the current exchange rate, and every figure across the dashboard, charts, tables, and forms is reformatted with the appropriate currency symbol and decimal precision for that currency.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/pottz0d.png" alt="Budgeable" />
</details>

- **Bank Account Synchronization** - Allows users to securely connect their bank accounts via Plaid. This synchronization automatically fetches account transactions—including details like amount, date, type, and description—as well as account balances. This simplifies data entry, reduces manual effort, and ensures that the financial information within the web application is consistently up-to-date by syncing directly with the user's financial institutions.

<details>
  <summary>See screenshot</summary><br>
<img src="https://i.imgur.com/rQoK7jn.png" alt="Budgeable" />
</details>

## 🚀 Getting Started

The following steps outline how to set up the project for local development and testing.

### 📋 Prerequisites

- **[Node.js](https://nodejs.org/)**: A JavaScript runtime environment that powers the backend of Budgeable and enables server-side JavaScript execution.
- **[Bun](https://bun.sh/docs/installation)**: An all-in-one JavaScript runtime, bundler, transpiler, and package manager.
- **[Git](https://git-scm.com/downloads)**: A distributed version control system needed to clone the repository and manage code changes.

> [!NOTE]
> Different package managers can be used (such as npm, pnpm, yarn), but the project was developed using Bun.

### ⚙️ Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/neilivanorencia/budgeable.git
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory. Use the following template:

   ```plaintext
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Clerk Authentication URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=

   # Database
   DATABASE_URL=

   # Plaid Integration
   PLAID_CLIENT_ID=
   PLAID_SECRET_KEY=

   # Application URLs
   NEXT_PUBLIC_APP_URL=
   ```

   - Clerk keys are available in the Clerk dashboard after creating an application.
   - A PostgreSQL connection string is required for `DATABASE_URL` (services like Neon, Supabase, or a local instance are supported).
   - Plaid API keys and environment can be obtained from the Plaid dashboard.

4. **Run database migrations**

   ```bash
   bun run db:migrate
   ```

### 🛠️ Development

Start the development server by running:

```bash
npm run dev
# or
pnpm run dev
# or
yarn dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with local browser to see the result.
