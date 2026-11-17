import { type SchemaTypeDefinition } from "sanity";
import { product } from "./product";
import { order } from "./order";
import { review } from "./review";
import { gallery } from "./gallery";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, order, review, gallery],
};
