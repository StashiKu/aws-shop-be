import { Injectable } from '@nestjs/common';
import { getDbConfig } from 'shared/db';
import { v4 } from 'uuid';
import { User } from '../models';
import { Client } from 'pg';

@Injectable()
export class UsersService {
  private readonly users: Record<string, User>;
  private readonly dbConfig: Record<string, string>;
  private readonly client: Client;

  constructor() {
    this.dbConfig = getDbConfig();
    this.client = new Client(this.dbConfig);
  }

  async findOne(userId: string): Promise<User> {
    try {
      await this.client.connect();
      await this.client.query('BEGIN');
  
      console.log(`START searching for a new user with name ${userId}`);
      const { rows: user } = await this.client.query(
        `SELECT * from "Users" WHERE "ID" = $1`,
        [userId]);
  
      await this.client.query('COMMIT');
  
      console.log(`User with name ${user[0].FIRST_NAME} and id ${user[0].ID} was SUCCESSFULLY found`)
      return user;
    } catch (err) {
      await this.client.query('ROLLBACK');

      throw err;
    } finally {
      this.client.end();
    }
  }

  async createOne(userName: string): Promise<User> {
    const id = v4(v4());
    try {
      await this.client.connect();
      await this.client.query('BEGIN');
  
      console.log(`START creation of a new user with name ${userName}`);
      const { rows: user } = await this.client.query(
        `INSERT INTO "Users" ("FIRST_NAME") VALUES ($1) RETURNING "ID", "FIRST_NAME"`,
        [userName]);
  
      await this.client.query('COMMIT');
  
      console.log(`User with name ${userName} and id ${user[0].ID} SUCCESSFULLY created`)
      return user;
    } catch (err) {
      await this.client.query('ROLLBACK');

      throw err;
    } finally {
      this.client.end();
    }
  }
}
