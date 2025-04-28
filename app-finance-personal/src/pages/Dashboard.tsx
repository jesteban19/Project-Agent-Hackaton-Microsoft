import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  // Calculate metrics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const incomeData = last7Days.map((date) =>
    transactions
      .filter((t) => t.type === "income" && t.date.startsWith(date))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expenseData = last7Days.map((date) =>
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(date))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const chartData = {
    labels: last7Days.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
      {
        label: "Expenses",
        data: expenseData,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-ios shadow-ios">
            <h3 className="text-sm text-gray-500">Total Income</h3>
            <p className="text-2xl font-bold text-green-500">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-ios shadow-ios">
            <h3 className="text-sm text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-500">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-ios shadow-ios col-span-2">
            <h3 className="text-sm text-gray-500">Balance</h3>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-ios shadow-ios">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Last 7 Days
          </h3>
          <div className="h-64">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
