import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { transactionService } from "../services/transactionService";
import { setTransactions } from "../store/slices/transactionsSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTransactions = await transactionService.getTransactions();
        dispatch(setTransactions(fetchedTransactions));
      } catch (err) {
        setError("Error al cargar las transacciones");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [dispatch]);

  // Calculate metrics
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "ingreso")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "gasto")
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
      .filter(
        (t) => t.type.toLowerCase() === "ingreso" && t.date.startsWith(date)
      )
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expenseData = last7Days.map((date) =>
    transactions
      .filter(
        (t) => t.type.toLowerCase() === "gasto" && t.date.startsWith(date)
      )
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Calculate category expenses
  const categoryExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "gasto")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  console.log(categoryExpenses);
  const categoryData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: last7Days.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: "Ingresos",
        data: incomeData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
      {
        label: "Gastos",
        data: expenseData,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh+170px)] bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh+100px)] bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-ios shadow-ios">
            <h3 className="text-sm text-gray-500">Total Ingresos</h3>
            <p className="text-2xl font-bold text-green-500">
              S/.{totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-ios shadow-ios">
            <h3 className="text-sm text-gray-500">Total Gastos</h3>
            <p className="text-2xl font-bold text-red-500">
              S/.{totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-ios shadow-ios col-span-2">
            <h3 className="text-sm text-gray-500">Balance</h3>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              S/.{balance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-ios shadow-ios mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Últimos 7 Días
          </h3>
          <div className="h-64">
            <Line
              data={lineChartData}
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

        <div className="bg-white p-4 rounded-ios shadow-ios">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Gastos por Categoría
          </h3>
          <div className="h-64">
            <Pie
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right" as const,
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
