"use server";

import { serverClient } from "@/sanity/lib/serverClient";
import { requireAuth } from "@/app/lib/auth";

export interface Order {
  _id: string;
  orderId: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    streetaddress: string;
    city: string;
    province: string;
    zipcode: string;
    country: string;
  };
  items: {
    _id: string;
    title: string;
    productImage: string;
    price: number;
  }[];
  itemPrices: number[];
  itemQuantities: number[];
  total: number;
  status: string;
  dispatchedAt: string;
  paymentMethod: string;
  createdAt: string;
}

const ORDER_PROJECTION = `{
  _id,
  orderId,
  user,
  "items": coalesce(items[]->{
    _id,
    title,
    "productImage": productImage.asset->url,
    price
  }, []),
  "itemPrices": coalesce(itemPrices, []),
  "itemQuantities": coalesce(itemQuantities, []),
  "total": coalesce(total, 0),
  status,
  dispatchedAt,
  paymentMethod,
  createdAt
}`;

export async function fetchOrders(): Promise<Order[]> {
  await requireAuth();
  const query = `*[_type == "order"] | order(createdAt desc) ${ORDER_PROJECTION}`;
  const orders: Order[] = await serverClient.fetch(
    query,
    {},
    { cache: "no-store" }
  );
  return orders;
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  await requireAuth();
  const query = `*[_type == "order" && _id == $id][0] ${ORDER_PROJECTION}`;
  const order: Order = await serverClient.fetch(
    query,
    { id },
    { cache: "no-store" }
  );
  return order || null;
}

export async function fetchDispatchedOrders(): Promise<Order[]> {
  await requireAuth();
  return await serverClient.fetch(
    `*[_type == "order" && status == "Dispatched"] | order(coalesce(dispatchedAt, createdAt, _createdAt) desc) ${ORDER_PROJECTION}`,
    {},
    { cache: "no-store" }
  );
}

export async function fetchShippedOrders(): Promise<Order[]> {
  await requireAuth();
  return await serverClient.fetch(
    `*[_type == "order" && status == "Shipped"] | order(coalesce(dispatchedAt, createdAt, _createdAt) desc) ${ORDER_PROJECTION}`,
    {},
    { cache: "no-store" }
  );
}

export async function fetchDeliveredOrders(): Promise<Order[]> {
  await requireAuth();
  return await serverClient.fetch(
    `*[_type == "order" && status == "Delivered"] | order(coalesce(dispatchedAt, createdAt, _createdAt) desc) ${ORDER_PROJECTION}`,
    {},
    { cache: "no-store" }
  );
}
