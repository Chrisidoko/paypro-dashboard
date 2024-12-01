/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideLayers,
} from "lucide-react";

import { Payment, columns } from "../payments/columns";
import { DataTable } from "../payments/data-table";

interface User {
  id: string;
  email: string;
  username: string;
  schoolID: number | null;
  role: "admin" | "user";
}

export default function Both() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [currentPage, setCurrentPage] = useState(1); // Track current page
  // const [totalPages, setTotalPages] = useState(1); // Track total pages
  // const transactionsPerPage = 10; // Number of transactions per page

  const fetchAllTransactions = async (
    schoolId: number | null = null
  ): Promise<Payment[]> => {
    const allTransactions: Payment[] = [];
    let currentPage = 1;
    let totalPages = 1;

    try {
      while (currentPage <= totalPages) {
        const apiUrl = new URL(
          `https://cors-anywhere-clone.onrender.com/https://api.kaduna.payprosolutionsltd.com/api/v1/transactions`
        );

        if (schoolId !== null) {
          apiUrl.searchParams.append("school_id", schoolId.toString());
        }

        apiUrl.searchParams.append("page", currentPage.toString());

        const response = await fetch(apiUrl.toString(), { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const apiResponse = await response.json();
        const { data, meta } = apiResponse.data;

        const formattedData: Payment[] = data.map((txn: Payment) => ({
          id: txn.id,
          amount: txn.amount,
          status: txn.status,
          txnRef: txn.txnRef || "N/A",
          createdAt: txn.createdAt,
          updatedAt: txn.updatedAt,
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

        allTransactions.push(...formattedData);
        currentPage = meta.currentPage + 1;
        totalPages = meta.lastPage;
      }
    } catch (error: unknown) {
      console.error("Failed to fetch transactions:", error);
      setError(
        (error as { message?: string })?.message ||
          "An unexpected error occurred"
      );
    }

    return allTransactions;
  };

  useEffect(() => {
    const loadUserAndTransactions = async () => {
      try {
        setLoading(true);

        // Fetch user
        const userResponse = await fetch("/api/session");
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch transactions for the user's school
        if (userData?.schoolID !== null) {
          const schoolTransactions = await fetchAllTransactions(
            userData.schoolID
          );
          setTransactions(schoolTransactions);
        } else {
          setTransactions([]);
        }
      } catch (err: unknown) {
        setError(
          (err as { message?: string })?.message || "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserAndTransactions();
  }, []); // Only run once on component mount

  // if (!user) {
  //   return (
  //     <div style={{ display: "flex" }}>
  //       <main style={{ padding: "8px", flexGrow: 1 }}>
  //         <div className="flex item-center justify center">
  //           <h1>Failed to fetch user</h1>
  //         </div>
  //       </main>
  //     </div>
  //   ); // Explicitly use `user` here
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>

          <Image
            src="/KD_logo.png"
            alt="Kaduna State logo"
            width={61}
            height={61}
            className="absolute inset-0 m-auto" // Adjust size as needed
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex" }}>
        <main style={{ padding: "8px", flexGrow: 1 }}>
          <div className="w-full h-full border-2 bg-white rounded-[15px]">
            <div className="mt-[17px] ml-[24px]">
              <h1 className="text-red-500">{error}</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div style={{ display: "flex" }}>
        <main style={{ padding: "8px", flexGrow: 1 }}>
          <div className="w-full h-full border-2 bg-white rounded-[15px]">
            <div className="mt-[17px] ml-[24px]">
              <h1>No Transactions Available</h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <main style={{ padding: "4px", flexGrow: 1 }}>
        <div className="w-full h-full bg-[#FAFBFD]">
          <div className="flex items-center justify-between">
            <div className="mt-4 ml-6 flex items-center gap-6 list-none text-[#0C141B] text-sm">
              <LucideArrowLeft size={16} color="#1D2529" />
              <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
              <LucideFolderOpen size={16} color="#1D2529" />
              <li>Project</li>
              <LucideChevronRight size={16} color="#1D2529" />
              <LucideLayers size={16} color="#1D2529" />
              <li>Transactions</li>
            </div>
          </div>
          <div className="ml-[56px] mr-[56px] pt-[50px]">
            <div className="scroll-m-20 text-4xl text-[#151D48] font-extrabold tracking-tight lg:text-4xl mb-[18px]">
              Transaction History
            </div>
            <DataTable columns={columns} data={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}
