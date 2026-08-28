"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Order } from "./OrderData";
import { formatDate } from "@/app/lib/formatDate";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    color: "#2e374a",
  },
  brandSub: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "right",
  },
  invoiceMeta: {
    fontSize: 9,
    color: "#666",
    textAlign: "right",
    marginTop: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginVertical: 16,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionBlock: {
    width: "48%",
  },
  label: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    marginBottom: 2,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2e374a",
    color: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  colProduct: { width: "45%" },
  colPrice: { width: "18%", textAlign: "right" },
  colQty: { width: "12%", textAlign: "right" },
  colSubtotal: { width: "25%", textAlign: "right" },
  totalsBlock: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginBottom: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#2e374a",
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: 700,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  statusBadge: {
    fontSize: 9,
    color: "#fff",
    backgroundColor: "#2e374a",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignSelf: "flex-start",
    marginTop: 6,
  },
});

export const OrderInvoicePDF = ({ order }: { order: Order }) => {
  const itemSubtotals = order.items.map(
    (item, index) => item.price * (order.itemQuantities[index] || 0),
  );
  const subtotal = itemSubtotals.reduce((sum, s) => sum + s, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>Furniro</Text>
            <Text style={styles.brandSub}>Furniture Marketplace</Text>
            <Text style={styles.brandSub}>www.furniro-abd.vercel.app</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>#{order.orderId}</Text>
            <Text style={styles.invoiceMeta}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionBlock}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.value}>
              {order.user.firstname} {order.user.lastname}
            </Text>
            <Text style={styles.value}>{order.user.email}</Text>
            <Text style={styles.value}>{order.user.phone}</Text>
            <Text style={styles.value}>{order.user.streetaddress}</Text>
            <Text style={styles.value}>
              {order.user.city}, {order.user.province} {order.user.zipcode}
            </Text>
            <Text style={styles.value}>{order.user.country}</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.label}>Order Details</Text>
            <Text style={styles.value}>Order ID: {order.orderId}</Text>
            <Text style={styles.value}>
              Payment Method: {order.paymentMethod}
            </Text>
            <Text style={styles.value}>
              Date: {formatDate(order.createdAt)}
            </Text>
            <Text style={styles.statusBadge}>{order.status}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colProduct}>Product</Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colSubtotal}>Subtotal</Text>
          </View>

          {order.items.map((item, index) => (
            <View style={styles.tableRow} key={item._id ?? index}>
              <Text style={styles.colProduct}>{item.title}</Text>
              <Text style={styles.colPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.colQty}>{order.itemQuantities[index]}</Text>
              <Text style={styles.colSubtotal}>
                ${itemSubtotals[index].toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

      
        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text>Shipping</Text>
            <Text>Free</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </View>
        <Text style={styles.footer}>
          Thank you for shopping with Furniro. For questions about this
          order, contact support@furniro.com
        </Text>
      </Page>
    </Document>
  );
};