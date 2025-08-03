import { client } from "@/sanity/lib/client";

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
  paymentMethod: string;
  createdAt: string;
}

export async function fetchOrders(): Promise<Order[]> {
  const query = `*[_type == "order"]{
    _id,
    orderId,
    user,
    "items": items[]->{
      _id,
      title,
      "productImage": productImage.asset->url,
      price
    },
    itemPrices,
    itemQuantities,
    total,
    status,
    paymentMethod,
    createdAt
  }`;

  const orders: Order[] = await client.fetch(query);
  return orders;
}
