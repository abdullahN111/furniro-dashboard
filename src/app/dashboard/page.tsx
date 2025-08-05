import Card from "@/app/components/admin/card/Card";
import Rightbar from "@/app/components/admin/rightbar/Rightbar";
import Transactions from "@/app/components/admin/transactions/Transactions";
import Order from "@/app/components/admin/orders/Order";
import Products from "@/app/components/admin/products/Products";
// import Chart from "@/app/components/admin/chart/Chart";

const Admin = () => {
  return (
    <div className="flex flex-col lg+:flex-row gap-3 sm:gap-4 mt-3 sm:mt-5 px-2 sm:px-0">
      <div className="flex-1 flex flex-col gap-3 sm:gap-5 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card />
          <Card />
          <Card />
        </div>
        <Order heading={"Orders"} />
        <Transactions heading={"Transactions"} />
        <Products heading="Products" />
        {/* <Chart /> */}
      </div>
      <div className="lg+:w-[255px] flex-shrink-0">
        <Rightbar />
      </div>
    </div>
  );
};

export default Admin;
