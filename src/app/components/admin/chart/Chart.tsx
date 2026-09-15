/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchOrders, Order } from "@/app/components/admin/orders/OrderData";
import DailyInsightsTable from "./DailyInsightsTable";

const WINDOW_DAYS = 30;

interface DayData {
  dateKey: string;
  label: string; 
  fullDate: string;
  orders: number;
  revenue: number;
}

const Chart = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodOffset, setPeriodOffset] = useState(0); // 0 = most recent 30 days

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await fetchOrders();
        setAllOrders(orders);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  
  const { rangeStart, rangeEnd, rangeLabel } = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const end = new Date(today);
    end.setDate(end.getDate() - periodOffset * WINDOW_DAYS);

    const start = new Date(end);
    start.setDate(start.getDate() - (WINDOW_DAYS - 1));
    start.setHours(0, 0, 0, 0);

    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const year = end.getFullYear();

    return {
      rangeStart: start,
      rangeEnd: end,
      rangeLabel: `${fmt(start)} - ${fmt(end)}, ${year}`,
    };
  }, [periodOffset]);

  const chartData: DayData[] = useMemo(() => {
    const days: DayData[] = [];
    const cursor = new Date(rangeStart);

    while (cursor <= rangeEnd) {
      const dateKey = cursor.toISOString().split("T")[0];
      const dayOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toISOString().split("T")[0] === dateKey;
      });

      days.push({
        dateKey,
        label: cursor.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: cursor.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        orders: dayOrders.length,
        revenue:
          Math.round(dayOrders.reduce((sum, o) => sum + o.total, 0) * 100) /
          100,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [allOrders, rangeStart, rangeEnd]);

  const totals = useMemo(() => {
    const revenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const orders = chartData.reduce((sum, d) => sum + d.orders, 0);
    return { revenue, orders };
  }, [chartData]);

  const isCurrentPeriod = periodOffset === 0;


  const earliestOrderDate = useMemo(() => {
    if (allOrders.length === 0) return null;
    return allOrders.reduce((earliest, o) => {
      const d = new Date(o.createdAt);
      return d < earliest ? d : earliest;
    }, new Date());
  }, [allOrders]);

  const canGoOlder =
    !earliestOrderDate ||
    rangeStart > earliestOrderDate ||
    rangeStart.toDateString() === earliestOrderDate.toDateString();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container bg-[--bgSoft] p-4 lg:p-2 xl:p-4 rounded-[10px] mb-8 mt-4 shadow-lg border border-[#2e374a]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 mb-2">
        <div>
          <h2 className="text-[--textSoft] text-lg font-bold">Revenue Recap</h2>
          <p className="text-xs text-[--textSoft] opacity-70">{rangeLabel}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriodOffset((p) => p + 1)}
            disabled={!canGoOlder && chartData.length > 0}
            className="text-xs px-3 py-1.5 rounded-md bg-[#1e2943] text-[--text] hover:bg-[#2a3a5c] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous 30 Days
          </button>
          <button
            onClick={() => setPeriodOffset((p) => Math.max(0, p - 1))}
            disabled={isCurrentPeriod}
            className="text-xs px-3 py-1.5 rounded-md bg-[#1e2943] text-[--text] hover:bg-[#2a3a5c] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next 30 Days →
          </button>
          {!isCurrentPeriod && (
            <button
              onClick={() => setPeriodOffset(0)}
              className="text-xs px-3 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700"
            >
              Today
            </button>
          )}
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2e374a" />
            <XAxis
              dataKey="label"
              stroke="#8884d8"
              interval="preserveStartEnd"
              minTickGap={20}
            />
            
            <YAxis
              yAxisId="revenue"
              stroke="#82ca9d"
              tickFormatter={(v) => `$${v}`}
            />
          
            <YAxis
              yAxisId="orders"
              orientation="right"
              stroke="#8884d8"
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#151c2c",
                border: "1px solid #2e374a",
                borderRadius: "8px",
              }}
              formatter={(value, name) => {
                if (name === "Revenue") return [`$${value}`, "Revenue"];
                return [value, "Orders"];
              }}
              labelFormatter={(_label, payload: any[]) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate;
                }
                return _label;
              }}
            />
            <Legend />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              name="Orders"
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between text-xs text-[--textSoft] border-t border-[#2e374a] pt-3">
        <div>Total Orders: {totals.orders}</div>
        <div>Total Revenue: ${totals.revenue.toFixed(2)}</div>
      </div>

      <DailyInsightsTable days={chartData} />
    </div>
  );
};

export default Chart;
