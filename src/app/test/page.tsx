"use client";
import { useState, useEffect } from "react";

interface Transaction {
  id: number;
  amount: number;
  paymentReference: string;
  status: string;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
  paymentItem: {
    name: string;
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(
          "https://api.kaduna.payprosolutionsltd.com/api/v1/transactions"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const apiResponse = await response.json();
        const data = apiResponse?.data?.data;

        if (data) {
          setTransactions(data);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <div>
      <h1>All Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Student Name</th>
            <th>Payment Item</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.id}</td>
              <td>{txn.amount}</td>
              <td>{txn.paymentReference}</td>
              <td>{txn.status}</td>
              <td>{new Date(txn.createdAt).toLocaleString()}</td>
              <td>
                {txn.student.firstName} {txn.student.lastName}
              </td>
              <td>{txn.paymentItem.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
