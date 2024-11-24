// components/Sidebar/Sidebar.tsx
'use client';
import React, { useState } from "react";
import Link from "next/link";
import { logout } from "../login/action";
import { 
  LucideHotel,
  LucideLayoutDashboard,
  LucideLayers,
  LucideRss,
  LucideInfo,
  LucideChevronLast,
  LucideChevronFirst,
  LucideLogOut} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex flex-col h-screen bg-gray-100 text-[#1C2529] transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[202px]"}`}>
      
      <div className="flex justify-end bg-[#9DA1A2] w-[28px] h-[22px] ml-[auto] mb-[10px] mt-[10px] rounded-md p-[2px]">
        <button
          className="w-[24px] h-[18px] bg-white rounded-[3px] flex items-center cursor-pointer p-[5px]"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <LucideChevronLast size={16} /> : <LucideChevronFirst size={16}/>}
        </button>
      </div>

      <div className="text-[#BABABA] text-xs ml-[15%] mb-[14px]">GENERAL</div>

      <ul className="list-none pl-0 ml-[5%] w-full">
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 hover:bg-white hover:rounded-[12px] hover:border hover:border-[#E3E3E3]">
          <Link href="/dashboard">
            <div className="flex flex-row items-center gap-[10px] text-[#1C2529]">
              <LucideLayoutDashboard size={18} />
              {isCollapsed ? "" : "Dashboard"}
            </div>
          </Link>
        </li>

        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 hover:bg-white hover:rounded-[12px] hover:border hover:border-[#E3E3E3]">
          <Link href="/web">
            <div className="flex flex-row items-center gap-[10px] text-[#1C2529]">
              <LucideRss size={18} />
              {isCollapsed ? "" : "WebPay"}
            </div>
          </Link>
        </li>

        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 hover:bg-white hover:rounded-[12px] hover:border hover:border-[#E3E3E3]">
          <Link href="/bankbranch">
            <div className="flex flex-row items-center gap-[10px] text-[#1C2529]">
              <LucideHotel size={18} />
              {isCollapsed ? "" : "Bank Branch"}
            </div>
          </Link>
        </li>

        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 hover:bg-white hover:rounded-[12px] hover:border hover:border-[#E3E3E3]">
          <Link href="/both">
            <div className="flex flex-row items-center gap-[10px] text-[#1C2529]">
              <LucideLayers size={18} />
              {isCollapsed ? "" : "Both"}
            </div>
          </Link>
        </li>
      </ul>

      <div className="bg-[#E3E3E3] h-[1px] w-[90%] mt-[57px] mb-[20px]"></div>

      <div className="text-[#BABABA] text-xs ml-[15%] mb-[14px]">SUPPORT</div>

      <ul className="list-none pl-0 ml-[5%] w-full">
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 hover:bg-white hover:rounded-[12px] hover:border hover:border-[#E3E3E3]">
          <Link href="#">
            <div className="flex flex-row items-center gap-[10px] text-[#1C2529]">
              <LucideInfo size={18} />
              {isCollapsed ? "" : "Help"}
            </div>
          </Link>
        </li>
      </ul>

      <div className="bg-[#E3E3E3] h-[1px] w-[90%] mt-[57px] mb-[20px]"></div>

      <div className="text-[#BABABA] text-xs ml-[15%] mb-[14px]">USER</div>


      <ul className="list-none pl-0 ml-[5%] w-full">
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 ">
          
            <div className="flex flex-row items-center gap-[10px] text-[#1C2529]">
              <LucideLogOut  size={18} /><button onClick={() => logout()}>{isCollapsed ? "" : "Logout"}</button>
            </div>
         
        </li>
      </ul>
      

    </div>
  );
};

export default Sidebar;
