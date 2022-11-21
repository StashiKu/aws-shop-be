import { Injectable } from '@nestjs/common';
import {Client} from 'pg';
import { getDbConfig } from 'shared/db';
import { Order } from '../models';

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {}
  private readonly dbConfig: Record<string, string>;
  private readonly client: Client;

  constructor() {
    this.dbConfig = getDbConfig();
    this.client = new Client(this.dbConfig);
  }

  findById(orderId: string): Order {
    return this.orders[ orderId ];
  }

  async create(data: any) {
    const {
      userId: USER_ID,
      status: STATUS,
      cartId: CART_ID,
      payment: PAYMENT,
      delivery: DELIVERY,
      comments: COMMNETS,
      total: TOTAL
    } = data;

    try {
      await this.client.connect();
      await this.client.query('BEGIN');

      const {rown: order} = this.client.query(
        `INSERT INTO "Orders" ("USER_ID", "STATUS", "CART_ID", "PAYMENT", "DELIVERY", "COMMENTS", "TOTAL")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "ID"`,
        [USER_ID, STATUS, CART_ID, PAYMENT, DELIVERY, COMMNETS, TOTAL]
      )

      await this.client.query('COMMIT');

      return order[0]

    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } finally {
      this.client.end()
    }
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[ orderId ] = {
      ...data,
      id: orderId,
    }
  }
}
