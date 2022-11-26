import { Injectable } from '@nestjs/common';

import { Cart } from '../models';
import { Client } from 'pg';
import { getDbConfig } from 'shared/db';
import { errorMonitor } from 'events';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};
  private readonly dbConfig: Record<string, string>;
  private readonly client: Client;

  constructor() {
    this.dbConfig = getDbConfig();
    this.client = new Client(this.dbConfig);
  }

  async findByUserId(userId: string): Promise<Cart[]> {
    try {
      await this.client.connect();
      await this.client.query('BEGIN');

      console.log(`START retrieving user cart`);

      const { rows: cart } = await this.client.query(
        `SELECT * FROM "Carts" c INNER JOIN "Cart_Items" ci
        ON c."ID" = ci."CART_ID" WHERE c."USER_ID" = $1`,
        [userId]
      );
      await this.client.query('COMMIT');

      return cart
    } catch (err) {
      await this.client.query('ROLLBACK');
      throw err;
    } finally {
      this.client.end()
    }
  }

  async createUserCart(user, cartItem): Promise<any> {
    const userId = user.id;
    const {productId, count} = cartItem;
    try {
      await this.client.connect();
      await this.client.query('BEGIN');

      console.log(`START creating user cart`);

      const date = new Date();
      const { rows: cart } = await this.client.query(
        `INSERT INTO "Carts" ("USER_ID", "updated_at", "created_at") VALUES ($1, $2, $3) RETURNING "ID"`,
        [userId, date, date]
      );

      const {rows: cartItem} = await this.client.query(
        `INSERT INTO "Cart_Items" ("CART_ID", "PRODUCT_ID", "COUNT") VALUES($1, $2, $3) 
        RETURNING "ID", "PRODUCT_ID", "COUNT", "CART_ID"`,
        [cart[0].ID, productId, count]
      )

      await this.client.query('COMMIT');

      return cartItem[0]
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } finally {
      this.client.end();
    }
  }

  async createByUserId(userId: string): Promise<Cart[]> {
    try {
      await this.client.connect();
      await this.client.query('BEGIN');

      console.log(`START creating of the user cart`);
      const date = new Date();
      const { rows: cart } = await this.client.query(
        `INSERT INTO "Carts" ("USER_ID", "updated_at", "created_at") VALUES ($1, $2, $3) RETURNING "ID"`,
        [userId, date, date]
      );

      console.log(`cart is created ${JSON.stringify(cart)}`)

      await this.client.query('COMMIT');

      return cart
    } catch (err) {
      await this.client.query('ROLLBACK');
      throw err;
    } 
    
  }

  async createCartItem(data, userId, cartId): Promise<any> {
    try {
      await this.client.query('BEGIN');

      const {rows: cartItem} = await this.client.query(
        `INSERT INTO "Cart_Items" ("CART_ID", "PRODUCT_ID", "COUNT") VALUES($1, $2, $3) RETURNING "ID"`,
        [cartId, data.id, data.count]
      )

      await this.client.query('COMMIT');   

   console.log(`cart item is created`)
      return cartItem[0]
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } 
  }

  async updateCartItem(cartId, count): Promise<any> {
    try {
      await this.client.query('BEGIN');

      const { rows: cartItem } = this.client.query(
        `UPDATE "Cart_Items" SET "COUNT" = $1 WHERE "ID" = $2`,
        [count, cartId]
      );
      await this.client.query('COMMIT');
      
      return cartItem;
    } catch (error) {
      await this.client.query('ROLLBACK');
      throw error;
    } finally {
      this.client.end();
    }
  }

  async updateByUserId(userId: string, {id, count}): Promise<any> {
    let cart;
    cart = await this.findByUserId(userId);

    if (!cart.length) {
      cart = await this.createByUserId(userId);

      return this.createCartItem({id, count}, userId, cart[0].ID);
    }

    const filtered = cart.filter(item => item.ID === id);
    return this.updateCartItem(filtered[0].ID, count)
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }
}
