"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrderInvoicePDF } from "./OrderInvoicePDF";
import { Order } from "./OrderData";
import { MdOutlinePictureAsPdf } from "react-icons/md";

export const PrintInvoiceButton = ({ order }: { order: Order }) => {
  return (
    <PDFDownloadLink
      document={<OrderInvoicePDF order={order} />}
      fileName={`invoice-${order.orderId}.pdf`}
      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
    >
      {({ loading }) => (
        <>
          <MdOutlinePictureAsPdf size={17} className="text-indigo-400" />
          <span>{loading ? "Generating PDF..." : "Download Invoice PDF"}</span>
        </>
      )}
    </PDFDownloadLink>
  );
};
