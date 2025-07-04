// components/Sidebar/Sidebar.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "../login/action";
import {
  LucideLayoutDashboard,
  LucideLayers,
  LucideInfo,
  LucideLogOut,
  LucideBuilding,
} from "lucide-react";

// Define the User type
interface User {
  id: string;
  email: string;
  username: string;
  schoolID: number | null;
  role: "admin" | "user"; // Add other properties
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/session");
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, []);

  return (
    <div
      className="h-[100%] fixed flex flex-col  bg-white text-[#1C2529] transition-all shadow-blue-gray-900/5 duration-300 
        w-[202px] pt-[4%]"
    >
      <div className="text-black text-xs ml-[15%] mb-[14px]">GENERAL</div>

      <ul className="list-none pl-0 ml-[5%] w-full">
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300  text-[#737791] hover:text-white hover:bg-[#D33833] hover:rounded-[8px]">
          <Link href="/dashboard">
            <div className="flex flex-row items-center  gap-[10px] ">
              <LucideLayoutDashboard size={18} />
              Dashboard
            </div>
          </Link>
        </li>
        {/* Conditionally render the button */}
        {user &&
          user.id === "1" && ( // Replace `1` with the valid ID condition
            <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300  text-[#737791] hover:text-white hover:bg-[#D33833] hover:rounded-[8px]">
              <Link href="/institutions">
                <div className="flex flex-row items-center  gap-[10px] ">
                  <LucideBuilding size={18} />
                  Institutions
                </div>
              </Link>
            </li>
          )}
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300  text-[#737791] hover:text-white hover:bg-[#D33833] hover:rounded-[8px] ">
          <Link href="/both">
            <div className="flex flex-row items-center gap-[10px] ">
              <LucideLayers size={18} />
              Transactions
            </div>
          </Link>
        </li>
      </ul>

      <div className="bg-[#E3E3E3] h-[1px] w-[90%] mt-[57px] mb-[20px]"></div>

      <div className="text-black text-xs ml-[15%] mb-[14px]">SUPPORT</div>

      <ul className="list-none pl-0 ml-[5%] w-full">
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center text-[#737791] cursor-pointer transition-all duration-300 hover:bg-white hover:rounded-[12px] hover:border hover:border-[#E3E3E3]">
          <Link href="#">
            <div className="flex flex-row items-center gap-[10px]">
              <LucideInfo size={18} />
              Help
            </div>
          </Link>
        </li>
      </ul>

      <div className="bg-[#E3E3E3] h-[1px] w-[90%] mt-[57px] mb-[20px]"></div>

      <div className="text-black text-xs ml-[15%] mb-[14px]">USER</div>

      <ul className="list-none pl-0 ml-[5%] w-full">
        <li className="py-[15px] px-[20px] w-[90%] h-[34px] flex items-center text-center cursor-pointer transition-all duration-300 ">
          <div className="flex flex-row items-center gap-[10px] text-[#737791]">
            <LucideLogOut size={18} />
            <button onClick={() => logout()}>Logout</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
