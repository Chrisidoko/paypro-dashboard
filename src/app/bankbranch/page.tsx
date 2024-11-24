// components/BankBranch/BankBranch.tsx
import React from "react";
import { LucideArrowLeft, LucideFolderOpen, LucideChevronRight, LucideHotel } from 'lucide-react';

import Sidebar from "../mycomponents/side-nav";

export default function BankBranch() {
  return (
    <div style={{ display: "flex"}}>
    <Sidebar />
      <main style={{ marginLeft: "0px", padding: "8px", flexGrow: 1 }}>
    <div className="w-full h-full border-2 bg-white rounded-[15px]">
      <div className="mt-[17px] ml-[24px] flex items-center gap-[23px] text-[#0C141B] text-[14px] list-none">
        <LucideArrowLeft size={16} />
        <div className="h-[13px] w-[2px] bg-[#D9D9D9]"></div>
        <LucideFolderOpen size={16} />
        <li >Project</li>
        <LucideChevronRight size={16} />
        <LucideHotel size={16} />
        <li >Bank Branch</li>
      </div>
    </div>
    </main>
    </div>
  );
}
