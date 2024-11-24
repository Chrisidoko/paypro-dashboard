import React from "react";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideLayers,
  LucideChevronDown,
} from "lucide-react";

import Sidebar from "../mycomponents/side-nav";

import { Payment, columns } from "../payments/columns";
import { DataTable } from "../payments/data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
      regno: "12345678TM",
      txnRef: "1332792739WP",
      desc: "Registration Fee",
    },
    {
      id: "728ed53f",
      amount: 200,
      status: "success",
      email: "a@example.com",
      regno: "12349678TM",
      txnRef: "1372792739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed54f",
      amount: 400,
      status: "success",
      email: "p@example.com",
      regno: "12345778TM",
      txnRef: "1372795739WP",
      desc: "Registration Fee",
    },
    {
      id: "728ed55f",
      amount: 300,
      status: "processing",
      email: "q@example.com",
      regno: "12356786MM",
      txnRef: "1372722739WP",
      desc: "Hostel Fee",
    },
    {
      id: "728ed53f",
      amount: 500,
      status: "success",
      email: "s@example.com",
      regno: "12345678EM",
      txnRef: "1372795739WP",
      desc: "Registration Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    {
      id: "728ed53f",
      amount: 5600,
      status: "success",
      email: "u@example.com",
      regno: "12345678EE",
      txnRef: "1372746739WP",
      desc: "Acceptance Fee",
    },
    // ...
  ];
}

export default async function Both() {
  const data = await getData();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: "0px", padding: "8px", flexGrow: 1 }}>
        <div className="w-full h-full border-2 bg-white rounded-[15px]">
          <div className="mt-[17px] ml-[24px] flex items-center gap-[23px] text-[#0C141B] text-[14px] list-none">
            <LucideArrowLeft size={16} color="#1D2529" />
            <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
            <LucideFolderOpen size={16} color="#1D2529" />
            <li>Project</li>
            <LucideChevronRight size={16} color="#1D2529" />
            <LucideLayers size={16} color="#1D2529" />
            <li>Both</li>
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
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
