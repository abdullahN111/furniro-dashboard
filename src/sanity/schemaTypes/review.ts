import { defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Product Review",
  type: "document",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    },
    {
      name: "orderId",
      title: "Order ID",
      type: "string",
    },
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
    },
    {
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5),
    },
    {
      name: "comment",
      title: "Comment",
      type: "text",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
  ],
});
