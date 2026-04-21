import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from '../env'

export const deleteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_DELETE_TOKEN,
  useCdn: false,
});