// components/BankBranch/BankBranch.tsx
import React from "react";
import {
  LucideArrowLeft,
  LucideFolderOpen,
  LucideChevronRight,
  LucideHotel,
} from "lucide-react";

import Sidebar from "../mycomponents/side-nav";

export default function BankBranch() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ padding: "4px", flexGrow: 1 }}>
        <div className="w-full h-[100vh] bg-[#FAFBFD]">
          <div className="flex items-center justify-between">
            <div className="mt-[17px] ml-[24px] flex items-center gap-[23px] text-[#0C141B] text-[14px] list-none">
              <LucideArrowLeft size={16} />
              <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
              <LucideFolderOpen size={16} />
              <li>Project</li>
              <LucideChevronRight size={16} />
              <LucideHotel size={16} />
              <li>Bank Branch</li>
            </div>
          </div>
          <div className="ml-[56px] mr-[56px] pt-[50px]">
            <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl mb-[18px]">
              Bank Branch
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
