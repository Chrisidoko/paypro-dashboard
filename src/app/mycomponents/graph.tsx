"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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

// Define the prop type for the Graph component
interface GraphProps {
  chartData: { day: string; count: number }[];
}

// const chartData = [
//   { day: "Monday", count: 186, mobile: 80 },
//   { day: "Tuesday", count: 305, mobile: 200 },
//   { day: "Wednesday", count: 237, mobile: 120 },
//   { day: "Thursday", count: 73, mobile: 190 },
//   { day: "Friday", count: 209, mobile: 130 },
//   { day: "Saturday", count: 214, mobile: 140 },
//   { day: "Sunday", count: 214, mobile: 140 },
// ]

const chartConfig = {
  desktop: {
    label: "WebPay",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Bankbranch",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Graph({ chartData }: GraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue History</CardTitle>
        <CardDescription>This Week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total Transaction Count Per Day
        </div>
      </CardFooter>
    </Card>
  );
}
