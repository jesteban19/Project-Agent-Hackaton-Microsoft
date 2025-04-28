import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { transactionService } from "../services/transactionService";
import { setTransactions } from "../store/slices/transactionsSlice";

const TransactionHistory = () => {
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
        // Here you would dispatch an action to update the Redux store
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

  // Calculate summary statistics
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "ingreso") {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  const balance = summary.income - summary.expenses;

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
      <div className="min-h-screen bg-gray-50 p-4">
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Historial de Transacciones
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-lg font-bold text-green-500">
              +${summary.income.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Gastos</p>
            <p className="text-lg font-bold text-red-500">
              -${summary.expenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Balance</p>
            <p
              className={`text-lg font-bold ${
                balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No hay transacciones registradas</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                  transaction.type === "ingreso"
                    ? "border-green-500"
                    : "border-red-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {transaction.description}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), "PPP", {
                        locale: es,
                      })}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${
                      transaction.type === "ingreso"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "ingreso" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      transaction.type === "ingreso"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.type === "ingreso" ? "Ingreso" : "Gasto"}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {transaction.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
