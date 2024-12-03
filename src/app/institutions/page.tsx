"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideBuilding,
  LucideDatabaseBackup,
} from "lucide-react";

// Define the User and Transaction types
interface User {
  id: string;
  email: string;
  username: string;
  schoolID: number | null;
  role: "admin" | "user";
}

interface Transaction {
  schoolId: number;
  amount: number;
  updatedAt: string; // ISO date string
}

interface Totals {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

const Institutions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [totalsBySchool, setTotalsBySchool] = useState<Record<number, Totals>>(
    {}
  );

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/session");
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, []);

  // Fetch transactions and compute totals
  useEffect(() => {
    async function fetchTransactions() {
      let transactions: Transaction[] = [];
      let page = 1;

      // Paginate and fetch transactions
      while (true) {
        const response = await fetch(
          `https://cors-anywhere-clone.onrender.com/https://api.kaduna.payprosolutionsltd.com/api/v1/payments?page=${page}`
        );
        const data = await response.json();
        transactions = [
          ...transactions,
          ...data.data.data.map((item: any) => ({
            schoolId: item.transaction.student.schoolId,
            amount: parseFloat(item.transaction.amount),
            updatedAt: item.transaction.updatedAt,
          })),
        ];

        if (data.data.meta.currentPage === data.data.meta.lastPage) break;
        page++;
      }

      // Filter for the required schools (7 and 8)
      const filteredTransactions = transactions.filter((t) =>
        [7, 8].includes(t.schoolId)
      );

      // Group and compute totals by schoolId
      const now = new Date();
      const groupedTotals: Record<number, Totals> = {};

      filteredTransactions.forEach((transaction) => {
        const { schoolId, amount, updatedAt } = transaction;
        const transactionDate = new Date(updatedAt);

        if (!groupedTotals[schoolId]) {
          groupedTotals[schoolId] = {
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
            thisYear: 0,
          };
        }

        const diffInDays = Math.floor(
          (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays < 1) groupedTotals[schoolId].today += amount;
        if (diffInDays < 7) groupedTotals[schoolId].thisWeek += amount;
        if (
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()
        ) {
          groupedTotals[schoolId].thisMonth += amount;
        }
        if (transactionDate.getFullYear() === now.getFullYear()) {
          groupedTotals[schoolId].thisYear += amount;
        }
      });

      setTotalsBySchool(groupedTotals);
    }

    fetchTransactions();
  }, []);

  // Render loading state if data is not ready
  if (user === null || Object.keys(totalsBySchool).length === 0) {
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

  return (
    <div>
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
                <LucideBuilding size={16} color="#1D2529" />
                <li>Institutions</li>
              </div>
            </div>
            <div className="ml-[56px] mr-[56px] pt-[50px]">
              <div className="text-4xl text-[#151D48] font-extrabold mb-[18px]">
                {user.username}
              </div>
              <span className="text-[#737791]">
                Revenue Collection Report for Schools
              </span>

              {/* Render totals for each school */}
              {Object.entries(totalsBySchool).map(([schoolId, totals]) => (
                <div key={schoolId} className="flex flex-col mt-[40px]">
                  <span className="text-[#D33833] mb-[30px] text-lg">
                    School ID: {schoolId}
                  </span>

                  <div className="flex items-center gap-5 h-[125px]">
                    {["Today", "This Week", "This Month", "This Year"].map(
                      (period, idx) => (
                        <div
                          key={idx}
                          className="w-[270px] bg-white h-full p-4 border border-[#ECECEC] rounded-lg"
                        >
                          <a className="text-sm text-[#555A5C] font-medium">
                            {period}
                          </a>
                          <div className="flex items-center gap-1 mt-2.5">
                            <Image
                              src="/naira.svg"
                              alt="Naira"
                              width={17.5}
                              height={18.68}
                            />
                            <li className="text-[24px] font-bold text-[#1C2529] list-none">
                              {idx === 0
                                ? totals.today.toLocaleString()
                                : idx === 1
                                ? totals.thisWeek.toLocaleString()
                                : idx === 2
                                ? totals.thisMonth.toLocaleString()
                                : totals.thisYear.toLocaleString()}
                            </li>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-5 h-5 bg-transparent rounded flex items-center justify-center">
                              <LucideDatabaseBackup size={14} color="#57B05D" />
                            </div>
                            <a className="text-xs font-medium text-[#7B91B0]">
                              {idx === 0
                                ? "Within the last 24 hours"
                                : idx === 1
                                ? "From the first day of this week"
                                : idx === 2
                                ? "Sum total for this month"
                                : "Sum for the year"}
                            </a>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Institutions;
