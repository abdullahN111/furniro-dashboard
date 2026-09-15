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
    if (days.length === 0) return null;
    return days.reduce((best, d) => (d.revenue > best.revenue ? d : best));
  }, [days]);

  const activeDays = days.filter((d) => d.orders > 0);
  const avgOrderValue =
    activeDays.length > 0
      ? activeDays.reduce((sum, d) => sum + d.revenue, 0) /
        activeDays.reduce((sum, d) => sum + d.orders, 0)
      : 0;

  const sortedDays = [...days].reverse().filter((d) => d.orders > 0);

  return (
    <div className="mt-6 border-t border-[#2e374a] pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h3 className="text-[--textSoft] text-sm font-bold">Daily Breakdown</h3>
        <div className="flex gap-4 text-xs text-[--textSoft]">
          <span>
            Active days:{" "}
            <span className="text-[--text] font-semibold">
              {activeDays.length}/{days.length}
            </span>
          </span>
          <span>
            Avg order value:{" "}
            <span className="text-[--text] font-semibold">
              ${avgOrderValue.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto rounded-md border border-[#2e374a]">
        <table className="w-full text-xs">
          <thead className="bg-[#1e2943] text-[--textSoft] sticky top-0">
            <tr>
              <th className="text-left p-2 font-medium">Date</th>
              <th className="text-right p-2 font-medium">Orders</th>
              <th className="text-right p-2 font-medium">Revenue</th>
              <th className="text-right p-2 font-medium">Avg / Order</th>
            </tr>
          </thead>
          <tbody>
            {sortedDays.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-[--textSoft]">
                  No orders in this period.
                </td>
              </tr>
            ) : (
              sortedDays.map((day) => {
                const isBest = bestDay && day.dateKey === bestDay.dateKey;
                const avg = day.orders > 0 ? day.revenue / day.orders : 0;

                return (
                  <tr
                    key={day.dateKey}
                    className={`border-t border-[#2e374a] ${isBest ? "bg-teal-900/30" : ""}`}
                  >
                    <td className="p-2 text-[--text]">
                      {day.fullDate}
                      {isBest && (
                        <span className="ml-2 text-teal-400 text-[10px] font-semibold">
                          ★ BEST DAY
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-right text-[--text]">
                      {day.orders}
                    </td>
                    <td className="p-2 text-right text-[--text] font-medium">
                      ${day.revenue.toFixed(2)}
                    </td>
                    <td className="p-2 text-right text-[--textSoft]">
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
