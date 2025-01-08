"use client";

import { LucideX } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { school, status } from "../payments/data";
import { DataTableFacetedFilter } from "../payments/data-table-faceted-filter";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";

import { saveAs } from "file-saver";
import { Payment } from "./columns";

interface DataTableToolbarProps<TData extends Record<string, unknown>> {
  table: Table<TData>;
}

export function DataTableToolbar<TData extends Record<string, unknown>>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("Date")?.setFilterValue([from, to]);
  };

  // Utility function to export filtered data as CSV with custom fields
  const exportToCSV = () => {
    const filteredRows = table.getFilteredRowModel().rows as unknown as {
      original: Payment; // Ensure each row has the Payment type
    }[];

    if (filteredRows.length === 0) {
      alert("No data to export.");
      return;
    }

    // Map filtered rows and include custom fields
    const csvData = filteredRows.map((row) => ({
      studentId: row.original.student?.studentId || "N/A",
      name: `${row.original.student?.firstName || ""} ${
        row.original.student?.lastName || ""
      }`,
      schoolName: row.original.student?.school?.name || "N/A",
      status: row.original.status || "N/A",
      // paymentChannel: row.original.paymentChannel || "N/A", // Include paymentChannel
      amount: row.original.amount || 0,
      txnRef: row.original.txnRef || "N/A",
      createdAt: row.original.createdAt || "N/A",
      updatedAt: row.original.updatedAt || "N/A",
    }));

    // Escape CSV values to handle special characters
    const escapeCsvValue = (value: unknown) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      // Define headers
      "Student ID,Student Name,School,Status,Amount,Transaction Reference,Created At,Updated At",
      ...csvData.map((row) =>
        // Map row values
        [
          row.studentId,
          row.name,
          row.schoolName,
          row.status,
          // row.paymentChannel,
          row.amount,
          row.txnRef,
          row.createdAt,
          row.updatedAt,
        ]
          .map(escapeCsvValue)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Dynamic file name
    const fileName = `filtered-data-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    saveAs(blob, fileName);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[78vw] flex items-start">
        <div className="flex flex-1 flex-wrap items-start gap-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={status}
            />
          )}

          {table.getColumn("schoolName") && (
            <DataTableFacetedFilter
              column={table.getColumn("schoolName")}
              title="Institution"
              options={school}
            />
          )}

          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="w-[250px] h-8"
            variant="outline"
          />

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 text-black"
            >
              Reset
              <LucideX className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="h-8 px-3 text-black"
          >
            Export to CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter Regno..."
          value={
            (table.getColumn("studentId")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("studentId")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] text-black"
        />

        <Input
          placeholder="Search Student Name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] text-black"
        />

        <Input
          placeholder="Filter Txn Ref..."
          value={(table.getColumn("txnRef")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("txnRef")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] text-black"
        />
      </div>
    </div>
  );
}
