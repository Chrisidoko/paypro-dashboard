"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LucideMoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: number;
  amount: number;
  status: "pending" | "successful" | "failed";
  txnRef: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  paymentItem: {
    name: string;
  };
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
    school: {
      name: string;
    };
  };
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "studentId", // Custom ID
    header: "Student ID",
    accessorFn: (row) => row.student.studentId, // Extract nested property
  },
  {
    id: "name", // Custom ID
    header: "Name",
    accessorFn: (row) => `${row.student.firstName} ${row.student.lastName}`, // Combine first and last name
  },

  {
    accessorKey: "status",
    header: "Status",
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  {
    accessorKey: "student.school.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          School
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "paymentItem.name",
    header: "Desc",
    cell: ({ row }) => {
      // Safely access `paymentItem.name` or provide a fallback
      const paymentItemName =
        row.original.paymentItem?.name || "No Description";
      return <span>{paymentItemName}</span>;
    },
  },
  {
    accessorKey: "txnRef",
    header: "Txn Ref",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <LucideMoreHorizontal size={16} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.txnRef}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },

  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
