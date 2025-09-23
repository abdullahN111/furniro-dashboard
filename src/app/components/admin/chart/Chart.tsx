/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchOrders, Order } from "@/app/components/admin/orders/OrderData";

const Chart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const orders = await fetchOrders();
        const weeklyData = processWeeklyData(orders);
        setChartData(weeklyData);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processWeeklyData = (orders: Order[]) => {
    const weeks = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - i * 7);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);

      const weekLabel = formatWeekLabel(weekStart, weekEnd);

      weeks.push({
        start: weekStart,
        end: weekEnd,
        weekLabel: weekLabel,
        fullDateRange: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
      });
    }

    return weeks.map((week) => {
      const weekOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= week.start && orderDate <= week.end;
      });

      const weekRevenue = weekOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      return {
        name: week.weekLabel,
        orders: weekOrders.length,
        revenue: Math.round(weekRevenue * 100) / 100,
        dateRange: week.fullDateRange,
      };
    });
  };

  const formatWeekLabel = (start: Date, end: Date): string => {
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const startDate = start.getDate();
    const endDate = end.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate}-${endDate}`;
    }

    return `${startMonth} ${startDate} - ${endMonth} ${endDate}`;
  };

  if (loading) {
    return (
      <div className="h-[400px] sm:h-[450px] w-full bg-[--bgSoft] p-[20px] rounded-[10px] flex items-center justify-center">
        <div className="text-[--textSoft]">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="h-[400px] sm:h-[450px] container bg-[--bgSoft] p-4 lg:p-2 xl:p-4 rounded-[10px] mb-8 mt-4 shadow-lg border border-[#2e374a]">
      <h2 className="text-[--textSoft] text-lg font-bold capitalize py-2 mb-4">
        Weekly Revenue Recap
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip
            contentStyle={{
              background: "#151c2c",
              border: "none",
              borderRadius: "8px",
            }}
            formatter={(value, name) => {
              if (name === "revenue") return [`$${value}`, "Revenue"];
              return [value, "Orders"];
            }}
            labelFormatter={(label: any, payload: any[]) => {
              if (payload && payload[0]) {
                return `Week: ${payload[0].payload.dateRange}`;
              }
              return label;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#8884d8"
            strokeDasharray="5 5"
            name="Orders"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex justify-between text-xs text-[--textSoft]">
        <div>
          Total Orders: {chartData.reduce((sum, week) => sum + week.orders, 0)}
        </div>
        <div>
          Total Revenue: $
          {chartData.reduce((sum, week) => sum + week.revenue, 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default Chart;
