import Image from "next/image";
import Link from "next/link";
import {
  MdLocalShipping,
  MdInsights,
  MdSchedule,
  MdArrowForward,
} from "react-icons/md";

const Rightbar = () => {
  return (
    <aside className="w-full xl:w-[260px] shrink-0">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 sticky top-24">
        <div className="bg-gradient-to-br from-[#111827] via-[#151f38] to-[#1e1b4b] p-5 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 w-28 h-28 pointer-events-none">
            <Image
              src="/images/astronaut.png"
              alt="Fulfillment visual"
              fill
              className="object-contain opacity-15"
            />
          </div>
          <div className="relative z-10 flex flex-col gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full w-fit">
              <MdSchedule className="text-indigo-400" size={14} />
              Automated SLA
            </span>
            <h3 className="text-sm font-bold text-white leading-snug">
              Smart Order Fulfillment Pipeline
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Orders marked as <strong>Dispatched</strong> automatically transition to{" "}
              <strong>Shipped</strong> after 6 hours and <strong>Delivered</strong> after 24 hours.
            </p>
            <Link
              href="/dashboard/dispatched-orders"
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 w-fit bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              <MdLocalShipping size={15} />
              <span>Open Dispatch Center</span>
              <MdArrowForward size={13} />
            </Link>
          </div>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full w-fit">
            <MdInsights className="text-emerald-400" size={14} />
            Analytics & Reports
          </span>
          <h3 className="text-sm font-bold text-white leading-snug">
            30-Day Revenue & Daily Breakdown
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Compare rolling 30-day revenue windows, identify peak sales days, and export customer order invoices as PDFs.
          </p>
          <Link
            href="/dashboard/insights"
            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 w-fit bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <span>Explore Insights</span>
            <MdArrowForward size={13} />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Rightbar;
