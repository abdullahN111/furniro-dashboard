import { defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Customer Gallery (#FuniroFurniture)",
  type: "document",
  fields: [
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
    },
    {
      name: "products",
      title: "Selected Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
  ],
});
