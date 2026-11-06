"use client";

import { useMemo } from "react";

interface DayData {
  dateKey: string;
  label: string;
  fullDate: string;
  orders: number;
  revenue: number;
}

const DailyInsightsTable = ({ days }: { days: DayData[] }) => {
  const bestDay = useMemo(() => {
    const active = days.filter((d) => d.revenue > 0);
    if (active.length === 0) return null;
    return active.reduce((best, d) => (d.revenue > best.revenue ? d : best));
  }, [days]);

  const activeDays = days.filter((d) => d.orders > 0);
  const avgOrderValue =
    activeDays.length > 0
      ? activeDays.reduce((sum, d) => sum + d.revenue, 0) /
        activeDays.reduce((sum, d) => sum + d.orders, 0)
      : 0;

  const sortedDays = [...days].reverse().filter((d) => d.orders > 0);

  return (
    <div className="mt-6 border-t border-slate-800/80 pt-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h3 className="text-slate-200 text-sm font-semibold">
          Daily Activity Breakdown
        </h3>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          <span>
            Active days:{" "}
            <span className="text-slate-100 font-semibold">
              {activeDays.length}/{days.length}
            </span>
          </span>
          <span>
            Avg order value:{" "}
            <span className="text-emerald-400 font-semibold">
              ${avgOrderValue.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto rounded-xl border border-slate-800">
        <table className="w-full text-xs">
          <thead className="bg-slate-900/95 text-slate-400 sticky top-0">
            <tr>
              <th className="text-left px-3.5 py-2.5 font-semibold uppercase tracking-wider">
                Date
              </th>
              <th className="text-right px-3.5 py-2.5 font-semibold uppercase tracking-wider">
                Orders
              </th>
              <th className="text-right px-3.5 py-2.5 font-semibold uppercase tracking-wider">
                Revenue
              </th>
              <th className="text-right px-3.5 py-2.5 font-semibold uppercase tracking-wider">
                Avg / Order
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {sortedDays.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  No orders recorded in this 30-day window.
                </td>
              </tr>
            ) : (
              sortedDays.map((day) => {
                const isBest = bestDay && day.dateKey === bestDay.dateKey;
                const avg = day.orders > 0 ? day.revenue / day.orders : 0;

                return (
                  <tr
                    key={day.dateKey}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isBest ? "bg-emerald-500/10" : ""
                    }`}
                  >
                    <td className="px-3.5 py-2.5 text-slate-200">
                      <span>{day.fullDate}</span>
                      {isBest && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                          ★ Peak Day
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-slate-200 font-medium">
                      {day.orders}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-emerald-400 font-semibold">
                      ${day.revenue.toFixed(2)}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-slate-400">
                      {day.orders > 0 ? `$${avg.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyInsightsTable;
