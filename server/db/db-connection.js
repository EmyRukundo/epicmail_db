import dotenv from 'dotenv';
import { Pool } from 'pg';
// import Helper from '../helpers/helpers';

dotenv.config();

class Database {
  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'andela',
      port: 5432
    });

    this.connect = async () => this.pool.connect();

    this.userTable = `
    CREATE TABLE user_table (
    id PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    password VARCHAR(120) NOT NULL,
    token VARCHAR(120)
        );
        `;
    this.contactsTable = `
    CREATE TABLE IF NOT EXISTS contacts_table (
        id PRIMARY KEY,
        email VARCHAR(120) NOT NULL UNIQUE,
        firstname VARCHAR(30) NOT NULL,
        lastname VARCHAR(30) NOT NULL,
    );
    `;
    this.messagesTable = `
    CREATE TABLE IF NOT EXISTS messages_table (
        id PRIMARY KEY,
        created_on DATE NOT NULL,    
        subject VARCHAR(60) NOT NULL,
        messages VARCHAR(128) NOT NULL,
        parentMessageId REFERENCES user_Table (id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL
    );
    `;
    this.sentTable = `
    CREATE TABLE IF NOT EXISTS sent_table(
        senderId REFERENCES user_table (id) ON DELETE CASCADE,
        messageId REFERENCES messages_table (id) ON DELETE CASCADE,
        created_on DATE NOT NULL
    );
    `;
    this.inboxTable = `
    CREATE TABLE IF NOT EXISTS inbox_table (
      receiverId REFERENCES user_table(id) ON DELETE CASCADE,
      messageId REFERENCES messages_table (id) ON DELETE CASCADE,
      created_on DATE NOT NULL
      
    )`;

    this.groupTable = `
    CREATE TABLE IF NOT EXISTS group_table (
        id PRIMARY KEY,
        groupName VARCHAR(128) NOT NULL
    );
    `;

    this.groupMembersTable = `
    CREATE TABLE IF NOT EXISTS groupMembers_table (
          id PRIMARY KEY,
        groupId REFERENCES group_table (id) ON DELETE CASCADE,
        userRole VARCHAR(128) NOT NULL,
    );
    `;
    this.initializeDb();
  }

  async executeQuery(query, data = []) {
    const connection = await this.connect();
    try {
      // execute a query with parameter
      if (data.length) {
        return await connection.query(query, data);
      }
      // execute a query without parameter
      return await connection.query(query);
    } catch (error) {
      return error;
    } finally {
      connection.release();
    }
  }

  async initializeDb() {
    await this.executeQuery(this.userTable);
    await this.executeQuery(this.contactsTable);
    await this.executeQuery(this.messagesTable);
    await this.executeQuery(this.sentTable);
    await this.executeQuery(this.inboxTable);
    await this.executeQuery(this.groupTable);
    await this.executeQuery(this.groupMembersTable);
  }
}
export default new Database();