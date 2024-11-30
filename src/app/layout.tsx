import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PersistentLayout from "./PersistentLayout";

import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"], // Add "latin-ext" if needed
  weight: ["400", "500", "600", "700"], // Select the desired weights
  variable: "--font-poppins", // Set a CSS variable for easier use
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Paypro Dashboard",
  description: "Payments Overview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#FAFBFD]`}
      >
        <PersistentLayout>{children}</PersistentLayout>
      </body>
    </html>
  );
}
