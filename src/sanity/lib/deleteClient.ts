import { createClient } from "next-sanity";

export const deleteClient = createClient({
  projectId: "your_project_id",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_DELETE_TOKEN,
  useCdn: false,
});