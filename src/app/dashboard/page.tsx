import Rightbar from "@/app/components/admin/rightbar/Rightbar";
import Transactions from "@/app/components/admin/transactions/Transactions";
import Order from "@/app/components/admin/orders/Order";
import Products from "@/app/components/admin/products/Products";
import ReportCards from "../components/admin/card/ReportCard";
import Chart from "../components/admin/chart/Chart";

const Admin = () => {
  return (
    <div className="space-y-6">
      <ReportCards />

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex-1 flex flex-col gap-6 min-w-0 w-full">
          <Chart />
          <Order heading="Recent Orders" />
          <Transactions heading="Recent Transactions" />
          <Products heading="Catalog Highlights" />
        </div>

        <Rightbar />
      </div>
    </div>
  );
};

export default Admin;
