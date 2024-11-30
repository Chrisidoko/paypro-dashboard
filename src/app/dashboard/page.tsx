"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideLayoutDashboard,
  LucideAward,
  LucideDatabaseBackup,
  LucideUser2,
} from "lucide-react";

// import { ChartPie } from "../mycomponents/piechart";
import { Graph } from "../mycomponents/graph";

// Define the User type
interface User {
  id: string;
  email: string;
  username: string;
  schoolID: number | null;
  role: "admin" | "user"; // Add other properties
}

interface Transaction {
  id: number;
  amount: number;
  paymentReference: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
  paymentItem: {
    name: string;
  };
}

// async function getTransactions(): Promise<Transaction[]> {
//   // Simulate API response
//   return [
//     // Add more transactions
//   ];
// }
//processChartData(data); // Process chart data after transactions are fetched
export default function Dashboard() {
  // States initialization
  // Initialize state with the correct type
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  //data fetching simulate to do additions
  const [totals, setTotals] = useState({ today: 0, thisWeek: 0, thisMonth: 0 });
  //data fetching for pie chart props
  // const [chartData, setChartData] = useState<
  //   { browser: string; visitors: number; fill: string }[]
  // >([]); // will uncoment when channels are available
  //for graph component
  const [transactionData, setTransactionData] = useState<
    { day: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    async function fetchAllTransactions(schoolId: number | null = null) {
      setLoading(true); // Ensure loading is true when fetching starts
      let allTransactions: Transaction[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          // Construct the base URL
          const url = new URL(
            `https://cors-anywhere-clone.onrender.com/https://api.kaduna.payprosolutionsltd.com/api/v1/transactions`
          );

          // Append the `school_id` parameter if provided
          if (schoolId !== null) {
            url.searchParams.append("school_id", schoolId.toString());
          }

          // Append pagination
          url.searchParams.append("page", currentPage.toString());

          const response = await fetch(url.toString());

          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }

          const apiResponse = await response.json();
          const { data, meta } = apiResponse?.data;

          // Add current page transactions to the list
          if (data) {
            allTransactions = allTransactions.concat(data);
          }

          // Update pagination info
          currentPage = meta.currentPage + 1;
          totalPages = meta.lastPage;
        }

        // Update state after all data is fetched
        setTransactions(allTransactions);
        computeTotals(allTransactions); // Calculate totals after all data is fetched
        //processChartData(data); // Process chart data after transactions are fetched
        processGraphData(allTransactions); // Process graph data
      } catch (err: unknown) {
        setError(
          (err as { message?: string })?.message ||
            "An unexpected error occurred"
        );
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }

    if (user) {
      // Fetch transactions based on the user's school ID
      fetchAllTransactions(user.schoolID);
    }
  }, [user]);

  // Function to compute totals for Today, This Week, and This Month
  const computeTotals = (transactions: Transaction[]) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const totalToday = transactions
      .filter((t) => {
        const txnDate = new Date(t.updatedAt);
        txnDate.setHours(0, 0, 0, 0);
        return (
          t.status === "successful" && txnDate.getTime() === today.getTime()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalThisWeek = transactions
      .filter((t) => {
        const txnDate = new Date(t.updatedAt);
        txnDate.setHours(0, 0, 0, 0);
        return (
          t.status === "successful" && txnDate >= weekStart && txnDate <= now
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalThisMonth = transactions
      .filter((t) => {
        const txnDate = new Date(t.updatedAt);
        txnDate.setHours(0, 0, 0, 0);
        return (
          t.status === "successful" && txnDate >= monthStart && txnDate <= now
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    setTotals({
      today: totalToday,
      thisWeek: totalThisWeek,
      thisMonth: totalThisMonth,
    });
  };

  // Function to process chart data
  // const processChartData = (transactions: Transaction[]) => {
  //   const processedData = [
  //     {
  //       browser: "WebPay",
  //       visitors: transactions.filter(
  //         (t) =>
  //           t.channel === "WebPay" &&
  //           new Date(t.updatedAt).getMonth() === new Date().getMonth()
  //       ).length,
  //       fill: "var(--color-chrome)",
  //     },
  //     {
  //       browser: "Bankbranch",
  //       visitors: transactions.filter(
  //         (t) =>
  //           t.channel === "Bankbranch" &&
  //           new Date(t.updatedAt).getMonth() === new Date().getMonth()
  //       ).length,
  //       fill: "var(--color-safari)",
  //     },
  //   ];
  //   setChartData(processedData);
  // };

  // Function to process graph data based on the transactions already fetched
  const processGraphData = (transactions: Transaction[]) => {
    // Get the current date and calculate the start and end of the week
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    // Start of the week: set the time to 00:00:00 (midnight) on the last Sunday
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay); // Go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Set to midnight

    // End of the week: set the time to 23:59:59 (one millisecond before midnight) on the Saturday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
    endOfWeek.setHours(23, 59, 59, 999); // Set to just before midnight

    // Filter transactions to include only those within the current week
    const filteredTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.updatedAt); // Get the transaction date
      return (
        txn.status === "successful" &&
        txnDate >= startOfWeek &&
        txnDate <= endOfWeek
      ); // Filter by week range
    });

    // Array to store the count of transactions per day of the week
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Initialize dailyCount with 0 transactions for each day of the week
    const dailyCount = daysOfWeek.map((day) => ({
      day,
      count: 0,
    }));

    // Count the transactions per day
    filteredTransactions.forEach((txn) => {
      const txnDate = new Date(txn.updatedAt); // Get the transaction date
      const dayOfWeek = txnDate.getDay(); // Get the day index (0 - 6)

      // Increment the transaction count for the corresponding day of the week
      dailyCount[dayOfWeek].count += 1;
    });

    // Set the transaction data in the state
    setTransactionData(dailyCount);
  }; // Empty dependency array to run only once when the component mounts

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
      <div className="flex items-center justify-center h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No transactions found</p>
      </div>
    );
  }

  if (!user) {
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
    <div style={{ display: "flex" }}>
      <main style={{ padding: "4px", flexGrow: 1 }}>
        <div className="bg-[#FAFBFD] w-full h-full transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="mt-4 ml-6 flex items-center gap-6 list-none text-[#0C141B] text-sm">
              <LucideArrowLeft size={16} color="#1D2529" />
              <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
              <LucideFolderOpen size={16} color="#1D2529" />
              <li>Project</li>
              <LucideChevronRight size={16} color="#1D2529" />
              <LucideLayoutDashboard size={16} color="#1D2529" />
              <li>Dashboard</li>
            </div>
          </div>
          <div className="ml-14">
            <div className="flex w-[773px] h-[81px] mt-12">
              <Image
                src="/KD_logo.png"
                alt="Kaduna State logo"
                width={81}
                height={81}
              />
              <div className="ml-5 flex flex-col">
                <a className="text-[24px] text-[#151D48] font-semibold mb-1">
                  {user.username}
                </a>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-3.5 p-1.5 text-[#57B05D] h-[28px] w-[97px] bg-[#57B05D20] border border-[#57B05D] rounded-[14.5px]">
                    <LucideAward size={15} />
                    <li className="list-none text-sm">Live</li>
                  </div>
                  <div className="flex items-center  justify-start gap-3 px-1 h-[29px] w-[153px] text-[#262D34] text-sm border border-[#E3E3E3] rounded-[14.5px]">
                    <div className="flex items-center justify-center text-[#63686A] w-[21px] h-[21px] bg-[#FFF4DE] rounded-full">
                      <LucideUser2 color="#FF947A" size={15} />
                    </div>
                    School Admin
                  </div>
                  <div className="text-sm text-[#63686A]">
                    Updated 5mins ago
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#E3E3E3] h-[1px] w-[94%] mt-7 mb-6"></div>
            <div className="flex items-center gap-5 h-[125px]">
              {["Today", "This Week", "This Month"].map((period, idx) => (
                <div
                  key={idx}
                  className="w-[270px] bg-white h-full p-4 border border-[#ECECEC] rounded-lg"
                >
                  <a className="text-sm text-[#555A5C] font-medium">{period}</a>
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
                        : totals.thisMonth.toLocaleString()}
                    </li>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-5 h-5 bg-transperent rounded flex items-center justify-center">
                      <LucideDatabaseBackup size={14} color="#57B05D" />
                    </div>
                    <a className="text-xs font-medium text-[#7B91B0]">
                      {idx === 0
                        ? "Within the last 24 hours"
                        : idx === 1
                        ? "From the first day of this week"
                        : "Sum total for this month"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-[100%] items-start gap-10 mt-9 mb-9 ">
              <div className=" w-[496px] h-[410px] p-2 bg-transparent rounded-md  ">
                <Graph chartData={transactionData} />
              </div>
              <div className="p-2 w-[500px] h-[420px] bg-transparent rounded-md ">
                {/* <ChartPie chartData={chartData} /> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
// function processGraphData(data: any) {
//   throw new Error("Function not implemented.");
// }
