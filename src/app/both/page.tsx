"use client";

import React, { useEffect, useState } from "react";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideLayers,
} from "lucide-react";

import Sidebar from "../mycomponents/side-nav";
import { Payment, columns } from "../payments/columns";
import { DataTable } from "../payments/data-table";

export default function Both() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on the client side
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await fetch(
          "https://cors-anywhere-clone.onrender.com/https://api.kaduna.payprosolutionsltd.com/api/v1/transactions",
          { cache: "no-store" } // Prevent caching, fetch fresh data
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const apiResponse = await response.json();

        // Map API data to your `Payment` type
        const data = apiResponse?.data?.data || [];
        const formattedData: Payment[] = data.map((txn: any) => ({
          id: txn.id,
          amount: txn.amount,
          status: txn.status,
          txnRef: txn.txnRef || "N/A",
          createdAt: txn.createdAt,
          updatedAt: txn.updatedAt,
          email: txn.email || "No Email Provided",
          paymentItem: {
            name: txn.paymentItem?.name || "No Description",
          },
          student: {
            firstName: txn.student?.firstName || "Unknown",
            lastName: txn.student?.lastName || "Unknown",
            studentId: txn.student?.studentId || "N/A",
            school: {
              name: txn.student?.school?.name || "No School Name",
            },
          },
        }));

        setTransactions(formattedData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ marginLeft: "0px", padding: "8px", flexGrow: 1 }}>
          <div className="w-full h-full border-2 bg-white rounded-[15px]">
            <div className="mt-[17px] ml-[24px]">
              <h1>Loading Transactions...</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || transactions.length === 0) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ marginLeft: "0px", padding: "8px", flexGrow: 1 }}>
          <div className="w-full h-full border-2 bg-white rounded-[15px]">
            <div className="mt-[17px] ml-[24px]">
              <h1>{error || "No Transactions Available"}</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main className="flex-grow p-1">
        <div className="w-full h-[100vh] bg-[#FAFBFD]">
          <div className="flex items-center justify-between">
            <div className="mt-[17px] ml-[24px] flex items-center gap-[23px] text-[#0C141B] text-[14px] list-none">
              <LucideArrowLeft size={16} color="#1D2529" />
              <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
              <LucideFolderOpen size={16} color="#1D2529" />
              <li>Project</li>
              <LucideChevronRight size={16} color="#1D2529" />
              <LucideLayers size={16} color="#1D2529" />
              <li>Both</li>
            </div>
          </div>
          <div className="ml-[56px] mr-[56px] pt-[50px]">
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl mb-[18px]">
              Both Channels
            </div>
            <div className="container mx-auto py-2">
              <DataTable columns={columns} data={transactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
