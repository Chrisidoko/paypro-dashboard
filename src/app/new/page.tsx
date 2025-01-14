"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideDatabaseBackup,
  LucideHotel,
} from "lucide-react";

// Define the User type
interface User {
  id: string;
  email: string;
  username: string;
  schoolID: number | null;
  role: "admin" | "user"; // Add other properties
}

interface Payment {
  id: string;
  transaction_reference: string;
  bill_reference: string;
  tpui: string;
  mdasId: string;
  full_name: string;
  student_id: string;
  school_id: string;
  email: string;
  phone: string;
  amount: string;
  status: string;
  narration: string | null;
  created_at: string;
  updated_at: string;
}

export default function BankBranch() {
  // States initialization
  // Initialize state with the correct type
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  //data fetching simulate to do additions
  const [totals, setTotals] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  // //data fetching for pie chart props
  // const [chartData, setChartData] = useState<
  //   { browser: string; visitors: number; fill: string }[]
  // >([]);

  // const [transactionData, setTransactionData] = useState<
  //   { day: string; count: number }[]
  // >([]);
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

  useEffect(() => {
    async function fetchAllTransactions(schoolId: string | null = null) {
      setLoading(true);
      let allTransactions: Payment[] = [];

      try {
        const baseUrl = `https://paypro.quantumcloud.ng/api/paykaduna/allTransactions/`;

        // Construct the URL for the first page
        const url = new URL(baseUrl);

        // Convert schoolId to string if it's a number
        if (schoolId) {
          url.searchParams.append("school_id", String(schoolId));
        }
        url.searchParams.append("page", "1");

        //console.log("Fetching transactions from:", url.toString());

        // Fetch the first page
        const initialResponse = await fetch(url.toString());
        if (!initialResponse.ok) {
          throw new Error(`Failed to fetch: ${initialResponse.statusText}`);
        }

        const initialData = await initialResponse.json();
        //console.log("Initial API Response:", initialData);

        // Ensure the response is successful
        if (!initialData.status) {
          throw new Error("API responded with an error status.");
        }

        const { data, metadata } = initialData;
        const totalPages = metadata?.last_page || 1;

        // Add the first page of data
        if (Array.isArray(data)) {
          allTransactions = allTransactions.concat(data);
        }

        // Fetch remaining pages if applicable
        const fetchPromises = [];
        for (let i = 2; i <= totalPages; i++) {
          const pageUrl = new URL(baseUrl);
          if (schoolId) {
            pageUrl.searchParams.append("school_id", String(schoolId));
          }
          pageUrl.searchParams.append("page", i.toString());

          // console.log(`Fetching page ${i} from:`, pageUrl.toString());

          fetchPromises.push(
            fetch(pageUrl.toString())
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch page ${i}`);
                }
                return response.json();
              })
              .then((pageData) => {
                if (pageData.status && Array.isArray(pageData.data)) {
                  return pageData.data;
                }
                throw new Error(`Invalid data on page ${i}`);
              })
          );
        }

        const results = await Promise.all(fetchPromises);

        results.forEach((pageData) => {
          allTransactions = allTransactions.concat(pageData);
        });

        setTransactions(allTransactions);
        computeTotals(allTransactions); // Calculate totals after all data is fetched
      } catch (err: unknown) {
        //console.error("Error fetching transactions:", err);
        setError((err as Error).message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      // console.log("Fetching transactions for user:", user);
      fetchAllTransactions(String(user.schoolID));
    }
  }, [user]);

  // Function to compute totals for Today, This Week, and This Month
  const computeTotals = (transactions: Payment[]) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const yearStart = new Date(now.getFullYear(), 0, 1);
    yearStart.setHours(0, 0, 0, 0);

    let totalToday = 0;
    let totalThisWeek = 0;
    let totalThisMonth = 0;
    let totalThisYear = 0;

    transactions.forEach((t) => {
      const txnDate = new Date(t.updated_at);
      txnDate.setHours(0, 0, 0, 0);

      const amount = parseFloat(t.amount); // Convert to number if needed

      if (t.status.toLowerCase() === "paid") {
        if (txnDate.getTime() === today.getTime()) {
          totalToday += amount;
        }
        if (txnDate >= weekStart && txnDate <= now) {
          totalThisWeek += amount;
        }
        if (txnDate >= monthStart && txnDate <= now) {
          totalThisMonth += amount;
        }
        if (txnDate >= yearStart && txnDate <= now) {
          totalThisYear += amount;
        }
      }
    });

    setTotals({
      today: totalToday,
      thisWeek: totalThisWeek,
      thisMonth: totalThisMonth,
      thisYear: totalThisYear,
    });
  };

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

  return (
    <main>
      <div className="w-full w-full h-full transition-all duration-300 bg-[#FAFBFD]">
        <div className="flex items-center justify-between">
          <div className="mt-[17px] ml-[24px] flex items-center gap-[23px] text-[#0C141B] text-[14px] list-none">
            <LucideArrowLeft size={16} />
            <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
            <LucideFolderOpen size={16} />
            <li>Project</li>
            <LucideChevronRight size={16} />
            <LucideHotel size={16} />
            <li>New</li>
          </div>
        </div>
        <div className="ml-[56px] mr-[56px] pt-[50px]">
          <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl mb-[18px]">
            New
          </div>
          <div className="flex items-center gap-5 h-[125px]">
            {["Today", "This Week", "This Month", "This Year"].map(
              (period, idx) => (
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
                        : idx === 2
                        ? totals.thisMonth.toLocaleString()
                        : totals.thisYear.toLocaleString()}
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
      </div>
    </main>
  );
}
