
"use client";

import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { OrderInvoicePDF } from "./OrderInvoicePDF";
import { Order } from "./OrderData";
import { useState } from "react";

export const PrintInvoiceButton = ({ order }: { order: Order }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<OrderInvoicePDF order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      printWindow?.addEventListener("load", () => {
        printWindow.print();
      });
    } catch (err) {
      console.error("Failed to generate invoice:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePrint}
        disabled={isGenerating}
        className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white px-5 py-2 rounded-md"
      >
        {isGenerating ? "Preparing..." : "Print Invoice"}
      </button>

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