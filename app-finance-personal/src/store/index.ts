import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "../store/slices/transactionsSlice";
import speechReducer from "../store/slices/speechSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    speech: speechReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
