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
  const [periodOffset, setPeriodOffset] = useState(0);

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
      rangeLabel: `${fmt(start)} – ${fmt(end)}, ${year}`,
    };
  }, [periodOffset]);

  const chartData: DayData[] = useMemo(() => {
    const days: DayData[] = [];
    const cursor = new Date(rangeStart);

    while (cursor <= rangeEnd) {
      const dateKey = cursor.toISOString().split("T")[0];
      const dayOrders = allOrders.filter((order) => {
        if (!order.createdAt) return false;
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
          Math.round(dayOrders.reduce((sum, o) => sum + (o.total || 0), 0) * 100) /
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
      <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#111827] p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800/90">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-white text-base sm:text-lg font-bold">
            Revenue &amp; Order Velocity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{rangeLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPeriodOffset((p) => p + 1)}
            disabled={!canGoOlder && chartData.length > 0}
            className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev 30d
          </button>
          <button
            onClick={() => setPeriodOffset((p) => Math.max(0, p - 1))}
            disabled={isCurrentPeriod}
            className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next 30d →
          </button>
          {!isCurrentPeriod && (
            <button
              onClick={() => setPeriodOffset(0)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Current
            </button>
          )}
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              yAxisId="revenue"
              stroke="#34d399"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${v}`}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              stroke="#818cf8"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                color: "#f8fafc",
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
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={false}
              name="Orders"
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={false}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3.5">
        <div>
          Window Orders:{" "}
          <span className="font-semibold text-slate-200">{totals.orders}</span>
        </div>
        <div>
          Window Volume:{" "}
          <span className="font-semibold text-emerald-400">
            ${totals.revenue.toFixed(2)}
          </span>
        </div>
      </div>

      <DailyInsightsTable days={chartData} />
    </div>
  );
};

export default Chart;
