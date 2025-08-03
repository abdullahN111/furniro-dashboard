import { defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    {
      name: "orderId",
      title: "Order ID",
      type: "string",
    },
    {
      name: "user",
      title: "User",
      type: "object",
      fields: [
        { name: "firstname", type: "string" },
        { name: "lastname", type: "string" },
        { name: "email", type: "string" },
        { name: "phone", type: "string" },
        { name: "streetaddress", type: "string" },
        { name: "city", type: "string" },
        { name: "province", type: "string" },
        { name: "zipcode", type: "string" },
        { name: "country", type: "string" },
      ],
    },
    {
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    {
      name: "itemPrices",
      title: "Item Prices",
      type: "array",
      of: [{ type: "number" }],
    },
    {
      name: "itemQuantities",
      title: "Item Quantities",
      type: "array",
      of: [{ type: "number" }],
    },
  
    {
      name: "total",
      title: "Total",
      type: "number",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Pending", "Shipped", "Delivered"],
      },
    },
    {
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
  ],
});