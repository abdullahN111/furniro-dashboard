import Card from "@/app/components/admin/card/Card";
import Rightbar from "@/app/components/admin/rightbar/Rightbar";
import Transactions from "@/app/components/admin/transactions/Transactions";
import Order from "@/app/components/admin/orders/Order";
import Products from "@/app/components/admin/products/Products";
// import Chart from "@/app/components/admin/chart/Chart";

const Admin = () => {
  return (
    <div className="flex flex-col lg+:flex-row gap-5 mt-5">
      <div className="flex-1 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card />
          <Card />
          <Card />
        </div>
        <Order heading={"Orders"} />
        <Transactions heading={"Transactions"} />
        <Products heading="Products" />
        {/* <Chart /> */}
      </div>
      <div className="lg+:max-w-xs xl:max-w-sm">
        <Rightbar />
      </div>
    </div>
  );
};

export default Admin;
