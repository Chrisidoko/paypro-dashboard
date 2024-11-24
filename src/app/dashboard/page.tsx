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
  LucideUserCircle2,
} from "lucide-react";

import { ChartPie } from "../mycomponents/piechart";
import { Graph } from "../mycomponents/graph";

import { logout } from "../login/action";

import Sidebar from "../mycomponents/side-nav";

// Define the User type
interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "user"; // Add other properties
}

// Define the transaction type
interface Transaction {
  id: string;
  amount: number;
  status: string;
  email: string;
  regno: string;
  txnRef: string;
  desc: string;
  date: string;
  channel: string;
  school: string; // School associated with the transaction
}

async function getTransactions(): Promise<Transaction[]> {
  // Simulate API response
  return [
    {
      id: "1",
      amount: 5000,
      status: "success",
      email: "a@example.com",
      regno: "123",
      txnRef: "txn1",
      desc: "Fee",
      date: "2024-11-24T12:00:00Z",
      channel: "Bankbranch",
      school: "COE GIDAN WAYA",
    },
    {
      id: "2",
      amount: 1000,
      status: "success",
      email: "b@example.com",
      regno: "124",
      txnRef: "txn2",
      desc: "Fee",
      date: "2024-11-24T12:00:00Z",
      channel: "WebPay",
      school: "COE GIDAN WAYA",
    },
    {
      id: "3",
      amount: 4000,
      status: "success",
      email: "c@example.com",
      regno: "125",
      txnRef: "txn3",
      desc: "Fee",
      date: "2024-11-15T12:00:00Z",
      channel: "WebPay",
      school: "COE GIDAN WAYA",
    },
    {
      id: "4",
      amount: 4000,
      status: "success",
      email: "c@example.com",
      regno: "125",
      txnRef: "txn3",
      desc: "Fee",
      date: "2024-11-16T12:00:00Z",
      channel: "WebPay",
      school: "KADUNA STATE UNIVERSITY",
    },
    {
      id: "5",
      amount: 34000,
      status: "success",
      email: "c@example.com",
      regno: "125",
      txnRef: "txn3",
      desc: "Fee",
      date: "2024-10-16T12:00:00Z",
      channel: "WebPay",
      school: "KADUNA STATE UNIVERSITY",
    },
    // Add more transactions
  ];
}

export default function Dashboard() {
  // Initialize state with the correct type
  const [user, setUser] = useState<User | null>(null);
  //data fetching simulate to add
  const [totals, setTotals] = useState({ today: 0, thisWeek: 0, thisMonth: 0 });
  //data fetching for pie chart props
  const [chartData, setChartData] = useState<
    { browser: string; visitors: number; fill: string }[]
  >([]);

  //for graph component
  const [transactionData, setTransactionData] = useState<
    { day: string; count: number }[]
  >([]);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/session"); // Call API route to fetch user data
      const data = await response.json();
      setUser(data); // Set the user state
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchAndComputeTotals() {
      const transactions = await getTransactions();

      // Get the current date and reset the time to midnight
      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0); // Reset the time for today

      // Compute the start of the week (Sunday), reset time to midnight
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Go back to Sunday
      weekStart.setHours(0, 0, 0, 0);

      // Compute the start of the month, reset time to midnight
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);

      const totalToday = transactions
        .filter((t) => {
          const txnDate = new Date(t.date);
          txnDate.setHours(0, 0, 0, 0); // Reset time for comparison
          return (
            t.status === "success" && txnDate.getTime() === today.getTime()
          ); // Compare only the date part of today
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const totalThisWeek = transactions
        .filter((t) => {
          const txnDate = new Date(t.date);
          txnDate.setHours(0, 0, 0, 0); // Reset time for comparison
          return (
            t.status === "success" && txnDate >= weekStart && txnDate <= now
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const totalThisMonth = transactions
        .filter((t) => {
          const txnDate = new Date(t.date);
          txnDate.setHours(0, 0, 0, 0); // Reset time for comparison
          return (
            t.status === "success" && txnDate >= monthStart && txnDate <= now
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      setTotals({
        today: totalToday,
        thisWeek: totalThisWeek,
        thisMonth: totalThisMonth,
      });
    }

    fetchAndComputeTotals();
  }, []);

  useEffect(() => {
    async function fetchAndProcessData() {
      const transactions = await getTransactions();

      const processedData = [
        {
          browser: "WebPay",
          visitors: transactions.filter(
            (t) =>
              t.channel === "WebPay" &&
              new Date(t.date).getMonth() === new Date().getMonth()
          ).length,
          fill: "var(--color-chrome)",
        },
        {
          browser: "Bankbranch",
          visitors: transactions.filter(
            (t) =>
              t.channel === "Bankbranch" && // Corrected filter condition
              new Date(t.date).getMonth() === new Date().getMonth()
          ).length,
          fill: "var(--color-safari)",
        },
      ];

      setChartData(processedData);
    }

    fetchAndProcessData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const transactions = await getTransactions();

      // Get the current date and calculate the start of the week (Sunday) and end of the week (Saturday)
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
        const txnDate = new Date(txn.date);
        return txnDate >= startOfWeek && txnDate <= endOfWeek;
      });

      // Create an array to store the count of transactions per day of the week
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dailyCount = daysOfWeek.map((day) => ({
        day,
        count: 0,
      }));

      // Count the transactions per day
      filteredTransactions.forEach((txn) => {
        const txnDate = new Date(txn.date);
        const dayOfWeek = txnDate.getDay(); // Get the day index (0 - 6)
        dailyCount[dayOfWeek].count += 1;
      });

      setTransactionData(dailyCount);
    }

    fetchData();
  }, []);

  // Place the loading state handling *after* hooks
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "0px", padding: "8px", flexGrow: 1 }}>
        <div className="border-2 bg-white rounded-lg w-full h-full">
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
            <div className="flex w-[573px] h-[81px] mt-12">
              <Image
                src="/KD_logo.png"
                alt="Kaduna State logo"
                width={81}
                height={81}
              />
              <div className="ml-5 flex flex-col">
                <a className="text-[30px] text-[#262D34] font-semibold mb-1">
                  {user.username}
                </a>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-3.5 p-1.5 text-[#57B05D] h-[29px] w-[97px] bg-[#57B05D20] border border-[#57B05D] rounded-[14.5px]">
                    <LucideAward size={15} />
                    <li className="list-none text-sm">Live</li>
                  </div>
                  <div className="flex items-center  justify-start gap-3 px-1 h-[29px] w-[153px] text-[#262D34] text-sm border border-[#E3E3E3] rounded-[14.5px]">
                    <div className="flex items-center justify-center text-[#63686A] w-[21px] h-[21px] bg-[#D9D9D9] rounded-full">
                      <LucideUser2 size={15} />
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
                  className="w-[270px] h-full p-4 border border-[#ECECEC] rounded-lg"
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
                    <div className="w-5 h-5 bg-[#57B05D20] rounded flex items-center justify-center">
                      <LucideDatabaseBackup size={14} color="#57B05D" />
                    </div>
                    <a className="text-xs font-semibold text-[#63686A]">
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
            <div className="flex items-start gap-10 mt-9 mb-9 ">
              <div className="w-[490] ">
                <Graph chartData={transactionData} />
              </div>
              <div className="w-[400] ">
                <ChartPie chartData={chartData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
