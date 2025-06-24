import React, { useState, useEffect, createContext, useContext } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

import {
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Target,
  Home,
  Car,
  PiggyBank,
  Briefcase,
  Landmark,
  CreditCard,
  ShieldCheck,
  Milestone,
  Calendar,
  X,
  MoreVertical,
} from "lucide-react";

// --- CONTEXT FOR GLOBAL STATE ---

const AppContext = createContext();

// --- MOCK DATA & HELPERS ---

const initialTransactions = [
  // June 2025 Data

  {
    id: 1,
    type: "income",
    name: "Salary",
    category: "Income",
    amount: 5000,
    date: "2025-06-01",
  },

  {
    id: 2,
    type: "expense",
    name: "Rent",
    category: "Needs",
    amount: 1500,
    date: "2025-06-01",
  },

  {
    id: 3,
    type: "expense",
    name: "Groceries",
    category: "Needs",
    amount: 400,
    date: "2025-06-05",
  },

  {
    id: 4,
    type: "expense",
    name: "Utilities",
    category: "Needs",
    amount: 150,
    date: "2025-06-10",
  },

  {
    id: 5,
    type: "expense",
    name: "Dinner Out",
    category: "Wants",
    amount: 80,
    date: "2025-06-12",
  },

  {
    id: 6,
    type: "expense",
    name: "Movie Tickets",
    category: "Wants",
    amount: 30,
    date: "2025-06-15",
  },

  {
    id: 7,
    type: "expense",
    name: "ETF Investment",
    category: "Savings",
    amount: 700,
    date: "2025-06-15",
  },

  {
    id: 8,
    type: "expense",
    name: "Savings Account",
    category: "Savings",
    amount: 500,
    date: "2025-06-15",
  },

  // May 2025 Data

  {
    id: 9,
    type: "income",
    name: "Salary",
    category: "Income",
    amount: 5000,
    date: "2025-05-01",
  },

  {
    id: 10,
    type: "expense",
    name: "Rent",
    category: "Needs",
    amount: 1500,
    date: "2025-05-01",
  },

  {
    id: 11,
    type: "expense",
    name: "Car Payment",
    category: "Needs",
    amount: 350,
    date: "2025-05-05",
  },

  {
    id: 12,
    type: "expense",
    name: "Concert",
    category: "Wants",
    amount: 120,
    date: "2025-05-20",
  },

  {
    id: 13,
    type: "expense",
    name: "Stock Purchase",
    category: "Savings",
    amount: 600,
    date: "2025-05-15",
  },
];

const initialGoals = {
  emergency: {
    isSet: true,

    target: 6900, // 3 * 2300 (avg monthly expense)

    current: 4500,

    months: 3,
  },

  independence: {
    isSet: true,

    currentAge: 30,

    retirementAge: 65,

    lifeExpectancy: 90,

    desiredIncome: 3000,

    currentSavings: 50000,

    expectedReturn: 7,

    target: 857143, // Simplified calculation

    monthlyContribution: 550,
  },

  custom: [
    {
      id: 1,
      name: "Dream Vacation to Japan",
      target: 8000,
      current: 2500,
      type: "short-term",
      deadline: "2026-07-01",
    },

    {
      id: 2,
      name: "House Down Payment",
      target: 50000,
      current: 15000,
      type: "long-term",
      deadline: "2030-01-01",
    },
  ],
};

const initialNetWorth = {
  assets: [
    { id: 1, category: "Cash", name: "Checking Account", value: 7500 },

    { id: 2, category: "Cash", name: "Savings Account", value: 12000 },

    { id: 3, category: "Investments", name: "Stock Portfolio", value: 50000 },

    { id: 4, category: "Property", name: "Primary Residence", value: 350000 },
  ],

  liabilities: [
    { id: 1, category: "Loans", name: "Mortgage", value: 250000 },

    { id: 2, category: "Credit Card", name: "Visa Card", value: 2500 },
  ],
};

const expenseCategories = ["Needs", "Wants", "Savings"];

const subCategories = {
  Needs: [
    "Rent/Mortgage",
    "Utilities",
    "Groceries",
    "Transportation",
    "Insurance",
  ],

  Wants: ["Dining Out", "Entertainment", "Shopping", "Hobbies", "Vacation"],

  Savings: ["Emergency Fund", "Retirement", "Investments", "Down Payment"],
};

const COLORS = {
  Needs: "#3b82f6", // blue-500

  Wants: "#ec4899", // pink-500

  Savings: "#22c55e", // green-500

  Income: "#f97316", // orange-500
};

// --- APP PROVIDER ---

const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(initialTransactions);

  const [goals, setGoals] = useState(initialGoals);

  const [netWorth, setNetWorth] = useState(initialNetWorth);

  const [activePage, setActivePage] = useState("Dashboard");

  const [userCustomCategories, setUserCustomCategories] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, { ...transaction, id: Date.now() }]);
  };

  const addCustomCategory = (category, subCategory) => {
    setUserCustomCategories((prev) => [...prev, { category, subCategory }]);
  };

  const value = {
    transactions,

    addTransaction,

    goals,

    setGoals,

    netWorth,

    setNetWorth,

    activePage,

    setActivePage,

    userCustomCategories,

    addCustomCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- UI COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",

    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",

    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Input = ({ label, id, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>

    <input
      id={id}
      {...props}
      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
);

const Select = ({ label, id, children, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>

    <select
      id={id}
      {...props}
      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
    >
      {children}
    </select>
  </div>
);

const ProgressBar = ({ current, target, colorClass = "bg-blue-500" }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
      <div
        className={`h-4 rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
};

// --- CHART COMPONENTS ---

const ActiveShapePieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;

    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);

    const cos = Math.cos(-RADIAN * midAngle);

    const sx = cx + (outerRadius + 10) * cos;

    const sy = cy + (outerRadius + 10) * sin;

    const mx = cx + (outerRadius + 30) * cos;

    const my = cy + (outerRadius + 30) * sin;

    const ex = mx + (cos >= 0 ? 1 : -1) * 22;

    const ey = my;

    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="font-bold text-lg"
        >
          {payload.name}
        </text>

        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />

        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />

        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />

        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="dark:fill-gray-300"
        >{`BGN ${value.toFixed(2)}`}</text>

        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`( ${(percent * 100).toFixed(2)}% )`}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

// --- PAGE COMPONENTS ---

// --- DASHBOARD ---

const Dashboard = () => {
  const { transactions, goals } = useContext(AppContext);

  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7);

    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0, needs: 0, wants: 0, savings: 0 };
    }

    if (t.type === "income") {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;

      if (t.category === "Needs") acc[month].needs += t.amount;

      if (t.category === "Wants") acc[month].wants += t.amount;

      if (t.category === "Savings") acc[month].savings += t.amount;
    }

    return acc;
  }, {});

  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      name: new Date(month + "-02").toLocaleString("default", {
        month: "short",
      }),

      Income: data.income,

      Expenses: data.expense,
    }))
    .reverse();

  const lastMonth = Object.keys(monthlyData).sort().pop();

  const lastMonthData = monthlyData[lastMonth] || {
    income: 0,
    expense: 0,
    needs: 0,
    wants: 0,
    savings: 0,
  };

  const totalIncomeLastMonth = lastMonthData.income;

  const ruleComplianceData =
    totalIncomeLastMonth > 0
      ? [
          {
            name: "Needs",
            value: lastMonthData.needs,
            target: totalIncomeLastMonth * 0.5,
          },

          {
            name: "Wants",
            value: lastMonthData.wants,
            target: totalIncomeLastMonth * 0.3,
          },

          {
            name: "Savings",
            value: lastMonthData.savings,
            target: totalIncomeLastMonth * 0.2,
          },
        ]
      : [];

  const emergencyFundStatus = goals.emergency.isSet
    ? (goals.emergency.current / goals.emergency.target) * 100
    : 0;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
            Yearly Income vs Expenses
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-700"
              />

              <XAxis dataKey="name" className="text-xs" />

              <YAxis className="text-xs" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",

                  backdropFilter: "blur(5px)",

                  border: "1px solid #ccc",

                  borderRadius: "10px",
                }}
              />

              <Legend />

              <Bar
                dataKey="Income"
                fill={COLORS["Income"]}
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="Expenses"
                fill={COLORS["Wants"]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
            Emergency Fund Status
          </h3>

          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />

                <path
                  className="text-green-500"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeDasharray={`${emergencyFundStatus}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {emergencyFundStatus.toFixed(0)}%
                </span>

                <span className="text-sm text-gray-500">Funded</span>
              </div>
            </div>

            <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
              BGN {goals.emergency.current.toLocaleString()} /{" "}
              {goals.emergency.target.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
          50/30/20 Rule Compliance (
          {lastMonth
            ? new Date(lastMonth + "-02").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            : ""}
          )
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ruleComplianceData.map((item) => {
            const percentage =
              totalIncomeLastMonth > 0
                ? (item.value / totalIncomeLastMonth) * 100
                : 0;

            const targetPercentage =
              totalIncomeLastMonth > 0
                ? (item.target / totalIncomeLastMonth) * 100
                : 0;

            const isOver = item.value > item.target;

            return (
              <div
                key={item.name}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4
                    className="font-semibold"
                    style={{ color: COLORS[item.name] }}
                  >
                    {item.name}
                  </h4>

                  <span
                    className={`font-bold ${
                      isOver && item.name !== "Savings"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <ProgressBar
                  current={item.value}
                  target={item.target}
                  colorClass={`bg-[${COLORS[item.name]}]`}
                />

                <div className="flex justify-between items-center text-xs mt-1 text-gray-500 dark:text-gray-400">
                  <span>Spent: BGN {item.value.toFixed(2)}</span>

                  <span>
                    Target: {targetPercentage.toFixed(0)}% (BGN{" "}
                    {item.target.toFixed(2)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// --- BUDGET ---

const Budget = () => {
  const {
    transactions,
    addTransaction,
    userCustomCategories,
    addCustomCategory,
  } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().substring(0, 7)
  );

  const monthlyTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseBreakdown = expenseCategories
    .map((cat) => ({
      name: cat,

      value: monthlyTransactions
        .filter((t) => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((item) => item.value > 0);

  const allMonths = [
    ...new Set(transactions.map((t) => t.date.substring(0, 7))),
  ]
    .sort()
    .reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Monthly Budget
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Track your income and expenses.
          </p>
        </div>

        <div className="flex gap-2">
          <Select
            id="month-select"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
          >
            {allMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(month + "-02").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </Select>

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="font-bold text-lg mb-4">Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
              <span className="font-semibold text-green-700 dark:text-green-300">
                Total Income
              </span>

              <span className="font-bold text-green-800 dark:text-green-200">
                BGN {monthlyIncome.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
              <span className="font-semibold text-red-700 dark:text-red-300">
                Total Expenses
              </span>

              <span className="font-bold text-red-800 dark:text-red-200">
                BGN {monthlyExpenses.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                Net Flow
              </span>

              <span className="font-bold text-blue-800 dark:text-blue-200">
                BGN {(monthlyIncome - monthlyExpenses).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-4">Expense Breakdown</h3>

          {expenseBreakdown.length > 0 ? (
            <ActiveShapePieChart data={expenseBreakdown} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No expense data for this month.
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-lg mb-4">Transactions</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-3">Date</th>

                <th className="p-3">Name</th>

                <th className="p-3">Category</th>

                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {monthlyTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                    {t.date}
                  </td>

                  <td className="p-3 font-medium">{t.name}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20`}
                      style={{
                        backgroundColor: `${COLORS[t.category]}33`,

                        color: COLORS[t.category],
                      }}
                    >
                      {t.category}
                    </span>
                  </td>

                  <td
                    className={`p-3 text-right font-bold ${
                      t.type === "income"
                        ? "text-green-600"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"} BGN {t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTransaction={addTransaction}
        userCustomCategories={userCustomCategories}
        addCustomCategory={addCustomCategory}
      />
    </div>
  );
};

const TransactionForm = ({
  isOpen,
  onClose,
  addTransaction,
  userCustomCategories,
  addCustomCategory,
}) => {
  const [type, setType] = useState("expense");

  const [name, setName] = useState("");

  const [amount, setAmount] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [category, setCategory] = useState("Needs");

  const [subCategory, setSubCategory] = useState("");

  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount) return;

    addTransaction({
      type,

      name,

      amount: parseFloat(amount),

      date,

      category: type === "income" ? "Income" : category,
    });

    if (isAddingCustom && subCategory) {
      addCustomCategory(category, subCategory);
    }

    onClose();

    setName("");

    setAmount("");

    setSubCategory("");

    setIsAddingCustom(false);
  };

  const currentSubCategories = subCategories[category] || [];

  const customSubCats = userCustomCategories
    .filter((c) => c.category === category)
    .map((c) => c.subCategory);

  const allSubCats = [...new Set([...currentSubCategories, ...customSubCats])];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 ${
              type === "expense"
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Expense
          </Button>

          <Button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 ${
              type === "income"
                ? "bg-green-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Income
          </Button>
        </div>

        <Input
          label="Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Amount (BGN)"
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <Input
          label="Date"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {type === "expense" && (
          <>
            <Select
              label="Category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <Select
              label="Sub-category"
              id="subcategory"
              value={subCategory}
              onChange={(e) => {
                if (e.target.value === "add-new") {
                  setIsAddingCustom(true);

                  setSubCategory("");
                } else {
                  setIsAddingCustom(false);

                  setSubCategory(e.target.value);
                }
              }}
            >
              <option value="">Select a sub-category...</option>

              {allSubCats.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}

              <option value="add-new" className="font-bold text-blue-600">
                -- Add New --
              </option>
            </Select>

            {isAddingCustom && (
              <Input
                label="New Sub-category Name"
                id="new-subcategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
              />
            )}
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Add Transaction</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- GOALS ---

const Goals = () => {
  const { goals, setGoals, transactions } = useContext(AppContext);

  const [modal, setModal] = useState(null); // null, 'emergency', 'independence', 'custom'

  const avgMonthlyExpenses = (() => {
    const expenseData = transactions.filter((t) => t.type === "expense");

    const monthlyTotals = expenseData.reduce((acc, t) => {
      const month = t.date.substring(0, 7);

      acc[month] = (acc[month] || 0) + t.amount;

      return acc;
    }, {});

    const totalsArray = Object.values(monthlyTotals);

    return totalsArray.length > 0
      ? totalsArray.reduce((a, b) => a + b, 0) / totalsArray.length
      : 2000;
  })();

  const handleCustomGoalSubmit = (newGoal) => {
    setGoals((prev) => ({
      ...prev,
      custom: [...prev.custom, { ...newGoal, id: Date.now(), current: 0 }],
    }));

    setModal(null);
  };

  const handleEmergencySubmit = (data) => {
    setGoals((prev) => ({
      ...prev,
      emergency: { ...prev.emergency, isSet: true, ...data },
    }));

    setModal(null);
  };

  const handleIndependenceSubmit = (data) => {
    // Simplified target calculation

    const yearsToRetirement = data.retirementAge - data.currentAge;

    const yearsInRetirement = data.lifeExpectancy - data.retirementAge;

    const futureValueFactor = Math.pow(
      1 + data.expectedReturn / 100,
      yearsToRetirement
    );

    const presentValueFactor =
      (1 - Math.pow(1 + data.expectedReturn / 100, -yearsInRetirement)) /
      (data.expectedReturn / 100);

    const target =
      (data.desiredIncome * 12 * presentValueFactor) / futureValueFactor;

    const requiredAnnuity = target - data.currentSavings * futureValueFactor;

    const monthlyContribution =
      requiredAnnuity /
        ((Math.pow(1 + data.expectedReturn / 100 / 12, yearsToRetirement * 12) -
          1) /
          (data.expectedReturn / 100 / 12)) || 0;

    setGoals((prev) => ({
      ...prev,

      independence: {
        ...prev.independence,

        isSet: true,

        ...data,

        target: isNaN(target) ? 0 : target,

        monthlyContribution: isNaN(monthlyContribution)
          ? 0
          : monthlyContribution,
      },
    }));

    setModal(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Financial Goals
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Set and track your path to financial success.
          </p>
        </div>

        <Button onClick={() => setModal("custom")}>
          <Plus size={18} /> Add Custom Goal
        </Button>
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-700">
        Essential Goals
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalCard
          icon={<ShieldCheck size={32} className="text-blue-500" />}
          title="Emergency Fund"
          onClick={() => setModal("emergency")}
          goal={goals.emergency}
        />

        <GoalCard
          icon={<Milestone size={32} className="text-purple-500" />}
          title="Financial Independence"
          onClick={() => setModal("independence")}
          goal={goals.independence}
        />
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-700">
        Your Custom Goals
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.custom.map((goal) => (
          <GoalCard
            key={goal.id}
            icon={<Target size={32} className="text-pink-500" />}
            title={goal.name}
            goal={goal}
          />
        ))}
      </div>

      {modal === "emergency" && (
        <EmergencyFundForm
          isOpen={true}
          onClose={() => setModal(null)}
          currentData={goals.emergency}
          avgMonthlyExpenses={avgMonthlyExpenses}
          onSubmit={handleEmergencySubmit}
        />
      )}

      {modal === "independence" && (
        <FinancialIndependenceForm
          isOpen={true}
          onClose={() => setModal(null)}
          currentData={goals.independence}
          onSubmit={handleIndependenceSubmit}
        />
      )}

      {modal === "custom" && (
        <CustomGoalForm
          isOpen={true}
          onClose={() => setModal(null)}
          onSubmit={handleCustomGoalSubmit}
        />
      )}
    </div>
  );
};

const GoalCard = ({ icon, title, goal, onClick }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
            {icon}
          </div>

          <div>
            <h4 className="font-bold text-lg">{title}</h4>

            {goal.type && <p className="text-sm text-gray-500">{goal.type}</p>}
          </div>
        </div>

        {onClick && (
          <button
            onClick={onClick}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <Edit size={18} />
          </button>
        )}
      </div>

      <div className="mt-4 flex-grow">
        <ProgressBar current={goal.current} target={goal.target} />
      </div>

      <div className="mt-2 flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Progress</span>

        <span className="font-semibold">
          BGN {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
        </span>
      </div>
    </Card>
  );
};

const EmergencyFundForm = ({
  isOpen,
  onClose,
  currentData,
  avgMonthlyExpenses,
  onSubmit,
}) => {
  const [months, setMonths] = useState(currentData.months || 3);

  const targetAmount = avgMonthlyExpenses * months;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ months, target: targetAmount });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Emergency Fund Goal">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Your average monthly expense is estimated at{" "}
          <strong className="text-gray-800 dark:text-white">
            BGN {avgMonthlyExpenses.toFixed(2)}
          </strong>
          . How many months of expenses do you want to cover?
        </p>

        <Input
          label="Months of Expenses"
          id="months"
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          min="1"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your new target will be:
          </p>

          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            BGN {targetAmount.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Save Goal</Button>
        </div>
      </form>
    </Modal>
  );
};

const FinancialIndependenceForm = ({
  isOpen,
  onClose,
  currentData,
  onSubmit,
}) => {
  const [formState, setFormState] = useState({
    currentAge: currentData.currentAge || 30,

    retirementAge: currentData.retirementAge || 65,

    lifeExpectancy: currentData.lifeExpectancy || 90,

    desiredIncome: currentData.desiredIncome || 3000,

    currentSavings: currentData.currentSavings || 50000,

    expectedReturn: currentData.expectedReturn || 7,
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.id]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formState);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial Independence Goal"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Current Age"
            id="currentAge"
            type="number"
            value={formState.currentAge}
            onChange={handleChange}
          />

          <Input
            label="Desired Retirement Age"
            id="retirementAge"
            type="number"
            value={formState.retirementAge}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Life Expectancy"
          id="lifeExpectancy"
          type="number"
          value={formState.lifeExpectancy}
          onChange={handleChange}
        />

        <Input
          label="Desired Monthly Income (at retirement)"
          id="desiredIncome"
          type="number"
          step="100"
          value={formState.desiredIncome}
          onChange={handleChange}
        />

        <Input
          label="Current Savings/Investments"
          id="currentSavings"
          type="number"
          step="1000"
          value={formState.currentSavings}
          onChange={handleChange}
        />

        <Input
          label="Expected Annual Return (%)"
          id="expectedReturn"
          type="number"
          step="0.1"
          value={formState.expectedReturn}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Calculate & Save</Button>
        </div>
      </form>
    </Modal>
  );
};

const CustomGoalForm = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const [target, setTarget] = useState("");

  const [deadline, setDeadline] = useState("");

  const [type, setType] = useState("short-term");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ name, target: parseFloat(target), deadline, type });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Custom Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., New Car"
        />

        <Input
          label="Target Amount (BGN)"
          id="target"
          type="number"
          step="100"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />

        <Input
          label="Deadline"
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <Select
          label="Goal Type"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="short-term">Short-term</option>

          <option value="long-term">Long-term</option>
        </Select>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Add Goal</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- NET WORTH ---

const NetWorth = () => {
  const { netWorth, setNetWorth } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalType, setModalType] = useState("asset"); // 'asset' or 'liability'

  const totalAssets = netWorth.assets.reduce((sum, a) => sum + a.value, 0);

  const totalLiabilities = netWorth.liabilities.reduce(
    (sum, l) => sum + l.value,
    0
  );

  const totalNetWorth = totalAssets - totalLiabilities;

  const handleAddItem = (item) => {
    if (modalType === "asset") {
      setNetWorth((prev) => ({
        ...prev,
        assets: [...prev.assets, { ...item, id: Date.now() }],
      }));
    } else {
      setNetWorth((prev) => ({
        ...prev,
        liabilities: [...prev.liabilities, { ...item, id: Date.now() }],
      }));
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Net Worth
        </h2>

        <p className="text-gray-500 dark:text-gray-400">
          A snapshot of your financial health.
        </p>
      </div>

      <Card className="text-center">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Total Net Worth
        </h3>

        <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 my-2">
          BGN{" "}
          {totalNetWorth.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <div className="flex justify-center gap-8 mt-4">
          <div>
            <p className="text-sm text-green-600">Assets</p>

            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              BGN{" "}
              {totalAssets.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-red-600">Liabilities</p>

            <p className="text-xl font-bold text-red-700 dark:text-red-400">
              BGN{" "}
              {totalLiabilities.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NetWorthCategory
          title="Assets"
          items={netWorth.assets}
          onAdd={() => {
            setModalType("asset");
            setIsModalOpen(true);
          }}
          iconMapping={{
            Cash: <DollarSign />,
            Investments: <TrendingUp />,
            Property: <Home />,
          }}
        />

        <NetWorthCategory
          title="Liabilities"
          items={netWorth.liabilities}
          onAdd={() => {
            setModalType("liability");
            setIsModalOpen(true);
          }}
          iconMapping={{ Loans: <Landmark />, "Credit Card": <CreditCard /> }}
        />
      </div>

      <NetWorthForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        onSubmit={handleAddItem}
      />
    </div>
  );
};

const NetWorthCategory = ({ title, items, onAdd, iconMapping }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>

        <Button onClick={onAdd}>
          <Plus size={16} /> Add {title.slice(0, -1)}
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-full text-gray-600 dark:text-gray-300">
                {iconMapping[item.category] || <Briefcase />}
              </div>

              <div>
                <p className="font-semibold">{item.name}</p>

                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            </div>

            <p className="font-bold">
              BGN{" "}
              {item.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const NetWorthForm = ({ isOpen, onClose, type, onSubmit }) => {
  const [name, setName] = useState("");

  const [value, setValue] = useState("");

  const [category, setCategory] = useState(type === "asset" ? "Cash" : "Loans");

  const assetCategories = ["Cash", "Investments", "Property", "Other"];

  const liabilityCategories = ["Loans", "Credit Card", "Other"];

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ name, value: parseFloat(value), category });

    setName("");

    setValue("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          id="nw-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Value (BGN)"
          id="nw-value"
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />

        <Select
          label="Category"
          id="nw-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {(type === "asset" ? assetCategories : liabilityCategories).map(
            (cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            )
          )}
        </Select>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Add Item</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- MAIN APP LAYOUT ---

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <PageContent />
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

const PageContent = () => {
  const { activePage } = useContext(AppContext);

  switch (activePage) {
    case "Dashboard":
      return <Dashboard />;

    case "Budget":
      return <Budget />;

    case "Goals":
      return <Goals />;

    case "Net Worth":
      return <NetWorth />;

    default:
      return <Dashboard />;
  }
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { activePage, setActivePage } = useContext(AppContext);

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} /> },

    { name: "Budget", icon: <PiggyBank size={20} /> },

    { name: "Goals", icon: <Target size={20} /> },

    { name: "Net Worth", icon: <Briefcase size={20} /> },
  ];

  const NavLink = ({ item }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();

        setActivePage(item.name);

        setIsSidebarOpen(false); // Close sidebar on mobile after click
      }}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
        activePage === item.name
          ? "bg-blue-600 text-white font-semibold shadow-lg"
          : "text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
      }`}
    >
      {item.icon}

      <span>{item.name}</span>
    </a>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            Finance Academy
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
};

const Header = ({ onMenuClick }) => (
  <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg sticky top-0 z-20 flex items-center justify-between p-4 lg:justify-end border-b dark:border-gray-700">
    <button
      onClick={onMenuClick}
      className="lg:hidden text-gray-600 dark:text-gray-300"
    >
      <MoreVertical />
    </button>

    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold">Welcome, User!</span>

      <img
        src={`https://placehold.co/40x40/E2E8F0/4A5568?text=U`}
        alt="User Avatar"
        className="w-10 h-10 rounded-full"
      />
    </div>
  </header>
);

export default App;
