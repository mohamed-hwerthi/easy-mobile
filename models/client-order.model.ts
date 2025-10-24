import { Address } from "./address.model";
import { ClientCustomer } from "./client-customer.model";
import { ClientOrderItem } from "./client-order-item.model";
import { OrderSource } from "./Order-source.model";

export interface ClientOrder {
  id?: string;
  orderItems: ClientOrderItem[];
  customer: ClientCustomer;
  total: number;
  subTotal: number;
  deliveryAddress: Address;
  status?: string;
  createdAt?: string;
  source: OrderSource;
}
