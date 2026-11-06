import ReportCards from "@/app/components/admin/card/ReportCard";
import Chart from "@/app/components/admin/chart/Chart";
import React from "react";

const InsightsPage = () => {
  return (
    <div className="space-y-6 min-w-0">
      <ReportCards />
      <Chart />
    </div>
  );
};

export default InsightsPage;
