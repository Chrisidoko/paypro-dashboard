"use client";

import { LucideX } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { school, status } from "../payments/data";
import { DataTableFacetedFilter } from "../payments/data-table-faceted-filter";
// // import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn("Date")?.setFilterValue([from, to]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[78vw] flex items-start ">
        <div className="flex flex-1 flex-wrap items-center gap-2">
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
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="w-[250px] h-8"
            variant="outline"
          />
        </div>
        <div className="ml-auto">
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
          className="h-8 w-[150px] lg:w-[250px]  text-black"
        />

        <Input
          placeholder="Search Student Name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]  text-black"
        />

        <Input
          placeholder="Filter Txn Ref..."
          value={(table.getColumn("txnRef")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("txnRef")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]  text-black"
        />
      </div>
    </div>
  );
}
