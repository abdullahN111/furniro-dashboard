import ReportCards from "@/app/components/admin/card/ReportCard";
import Chart from "@/app/components/admin/chart/Chart";
import React from "react";

const page = () => {
  return (
    <div className="my-6 min-w-0 overflow-hidden">
      <ReportCards />
      <Chart />
    </div>
  );
};

export default page;
