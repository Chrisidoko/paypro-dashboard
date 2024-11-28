import React from "react";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideLayers,
} from "lucide-react";

import Sidebar from "../mycomponents/side-nav";

import { Payment, columns } from "../payments/columns";
import { DataTable } from "../payments/data-table";

async function fetchTransactionData(): Promise<Payment[]> {
  try {
    const response = await fetch(
      "https://api.kaduna.payprosolutionsltd.com/api/v1/transactions",
      { cache: "no-store" } // Prevent caching, fetch fresh data
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Define the API response structure (if it differs from `Payment`)
    type ApiTransaction = {
      id: number;
      amount: number;
      status: "pending" | "successful" | "failed";
      txnRef?: string;
      createdAt: string;
      updatedAt: string;
      email?: string;
      paymentItem?: {
        name?: string;
      };
      student?: {
        firstName?: string;
        lastName?: string;
        studentId?: string;
        school?: {
          name?: string;
        };
      };
    };
    const apiResponse = await response.json();
    const data: ApiTransaction[] = apiResponse?.data?.data || [];
    return data.map(
      (txn): Payment => ({
        id: txn.id,
        amount: txn.amount,
        status: txn.status,
        txnRef: txn.txnRef || "N/A", // Fallback if field is missing
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
      })
    );
  } catch {
    return []; /// Return an empty array as fallback
  }
}

export default async function Both() {
  let transactions: Payment[];
  try {
    transactions = await fetchTransactionData();
  } catch {
    transactions = []; // Use fallback data or show an error message
  }
  if (transactions.length === 0) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ marginLeft: "0px", padding: "8px", flexGrow: 1 }}>
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
            {/* <div className="w-[100%] h-[144px] rounded-[14px] border border-solid border-gray-300 p-[15px]">
              <div className="flex items-center gap-[10px]">
                <div className="pl-[20px] flex items-center gap-[30%] w-[247px] h-[49px] rounded-[8px] border border-solid border-[#E4E6E7] text-[14px] text-black">
                  <a>--Choose School--</a>
                  <LucideChevronDown size={20} />
                </div>
                <div className="pl-[20px] flex items-center gap-[30%] w-[247px] h-[49px] rounded-[8px] border border-solid border-[#E4E6E7] text-[14px] text-black">
                  <a>--Choose Faculty--</a>
                  <LucideChevronDown size={20} />
                </div>
                <div className="pl-[20px] flex items-center gap-[30%] w-[247px] h-[49px] rounded-[8px] border border-solid border-[#E4E6E7] text-[14px] text-black">
                  <a>--Choose Dept--</a>
                  <LucideChevronDown size={20} />
                </div>
                <div className="pl-[20px] flex items-center gap-[30%] w-[247px] h-[49px] rounded-[8px] border border-solid border-[#E4E6E7] text-[14px] text-black">
                  <a>--Choose Desc--</a>
                  <LucideChevronDown size={20} />
                </div>
              </div>
            </div> */}

            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={transactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
