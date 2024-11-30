"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./mycomponents/side-nav";

export default function PersistentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where the sidebar should not be displayed
  const excludedRoutes = ["/login", "/register"];

  const showSidebar = !excludedRoutes.includes(pathname);

  return (
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />}
      <main style={{ marginLeft: showSidebar ? "200px" : "0", flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
}
