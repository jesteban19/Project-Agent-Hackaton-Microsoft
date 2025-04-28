import { useSelector } from "react-redux";
import { RootState } from "../store";
import { format } from "date-fns";

const TransactionHistory = () => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Transaction History
        </h1>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white p-4 rounded-ios shadow-ios"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {transaction.description}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2">
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
