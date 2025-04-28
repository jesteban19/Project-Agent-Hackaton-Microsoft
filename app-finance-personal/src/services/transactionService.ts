const API_BASE_URL = "/api/handler";

export interface TransactionResponse {
  id: number;
  amount: number;
  category: string;
  created_at: string;
  date: string;
  description: string;
  type: "ingreso" | "gasto";
  username: string;
}

export const transactionService = {
  async getTransactions(): Promise<TransactionResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`);
      if (!response.ok) {
        throw new Error("Error al obtener las transacciones");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  async createTransaction(
    transaction: Omit<TransactionResponse, "id" | "created_at">
  ): Promise<TransactionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) {
        throw new Error("Error al crear la transacción");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },
};
