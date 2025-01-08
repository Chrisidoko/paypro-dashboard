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

export interface Payment {
  id: number;
  amount: number;
  paymentReference: string;
  status: "pending" | "completed" | "failed"; // Adjust based on possible values
  paymentChannel: string;
  createdAt: string;
  updatedAt: string;
  studentId: number;
  txnRef: string;
  paymentItemId: number;
  paymentItem: {
    id: number;
    name: string;
    schoolId: number;
    schoolRevenueId: number;
    amount: string;
    description: string;
    status: "active" | "inactive"; // Adjust based on possible values
    createdAt: string;
    updatedAt: string;
    paymentItemId: string;
  };
  student: {
    id: number;
    studentId: string;
    schoolId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    school: {
      id: number;
      schoolId: string;
      name: string;
      schoolEmail: string;
      schoolPhone: string;
      schoolAddress: string;
      lgaId: number;
      tin: string;
      contactAdminPhone: string;
      contactAdminFirstName: string;
      contactAdminLastName: string;
      contactAdminEmail: string;
      contactAdminAddress: string;
      rcNumber: string;
      industryId: string;
      tpui: string;
      contactGender: "male" | "female"; // Adjust based on possible values
      password: string;
      createdAt: string;
      updatedAt: string;
      noOfStaffs: number;
    };
  };
}

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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    id: "schoolName",
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
    cell: ({ getValue }) => {
      const value = getValue() as string; // Get the value for this cell
      const truncatedValue =
        value.length > 20 ? `${value.slice(0, 20)}...` : value; // Truncate to 20 characters
      return (
        <div className="truncate" title={value}>
          {truncatedValue}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentItem.name",
    header: "Desc",
    cell: ({ getValue }) => {
      // Safely access `paymentItem.name` or provide a fallback
      const value = getValue() as string; // Get the value for this cell
      const truncatedValue =
        value.length > 20 ? `${value.slice(0, 20)}...` : value; // Truncate to 20 characters
      // const paymentItemName =
      // getValue.original.paymentItem?.name || "No Description";
      return (
        <div className="truncate" title={value}>
          {truncatedValue}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Date",
  //   cell: ({ row }) => (
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger>
  //           <LucideMoreHorizontal size={16} />
  //         </TooltipTrigger>
  //         <TooltipContent>
  //           <p>{row.original.updatedAt}</p>
  //         </TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   ),
  // },
  {
    accessorKey: "txnRef",
    header: "Txn Ref",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <LucideMoreHorizontal size={20} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.txnRef}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "updatedAt",
    id: "Date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt); // Convert to Date object
      return (
        <p>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
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
