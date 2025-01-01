"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the type for chartData
interface ChartData {
  browser: string;
  visitors: number;
  fill: string;
}
// Accept 'chartData' as a prop
interface ChartPieProps {
  chartData: ChartData[]; // Typing the chartData prop here
}

// const chartData = [
//   { browser: "Web", visitors: 375, fill: "var(--color-chrome)" },
//   { browser: "Bankbranch", visitors: 280, fill: "var(--color-safari)" },

// ]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Web",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Bankbranch",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartPie({ chartData }: ChartPieProps) {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  // Get the current date
  const currentDate = new Date();
  // Get the full year
  const year = currentDate.getFullYear();
  // Get the current month (e.g., "December")
  const month = currentDate.toLocaleString("default", { month: "long" });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Monthly Payment Channel</CardTitle>
        <CardDescription>
          {month} {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Transactions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex mt-[20px] gap-[20px] leading-none text-muted-foreground">
          <div className="flex ">
            <div className="h-[13px] w-[20px] bg-[#e76e50] rounded mr-[5px]">
              {" "}
            </div>
            WebPay
          </div>

          <div className="flex">
            <div className=" h-[13px] w-[20px] bg-[#289d90] rounded mr-[5px]  ">
              {" "}
            </div>
            Bankbranch
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
