import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionResponse } from "../../services/transactionService";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface TransactionsState {
  transactions: TransactionResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionResponse>) => {
      state.transactions.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTransactions: (state, action: PayloadAction<TransactionResponse[]>) => {
      state.transactions = action.payload;
    },
  },
});

export const { addTransaction, setLoading, setError, setTransactions } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
