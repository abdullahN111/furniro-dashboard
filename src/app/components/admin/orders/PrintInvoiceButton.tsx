"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrderInvoicePDF } from "./OrderInvoicePDF";
import { Order } from "./OrderData";

export const PrintInvoiceButton = ({ order }: { order: Order }) => {

  return (
    <div className="flex gap-2">

      <PDFDownloadLink
        document={<OrderInvoicePDF order={order} />}
        fileName={`invoice-${order.orderId}.pdf`}
        className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-md flex items-center"
      >
        {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};