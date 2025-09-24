import Rightbar from "@/app/components/admin/rightbar/Rightbar";
import Transactions from "@/app/components/admin/transactions/Transactions";
import Order from "@/app/components/admin/orders/Order";
import Products from "@/app/components/admin/products/Products";
import ReportCards from "../components/admin/card/ReportCard";
import Chart from "../components/admin/chart/Chart";

const Admin = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-3 xl:gap-5 mt-6 sm:mt-10">
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
        <ReportCards />

        <Chart />
        <Order heading={"Orders"} />
        <Transactions heading={"Transactions"} />
        <Products heading="Products" />
      </div>

      <Rightbar />
    </div>
  );
};

export default Admin;
