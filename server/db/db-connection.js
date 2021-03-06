import dotenv from 'dotenv';
import pg from 'pg';


dotenv.config();

// class Database {
//   constructor() {
//     this.pool = new Pool({
//       user: 'epic_mail',
//       host: 'localhost',
//       database: 'epic_mail',
//       password: 'andela',
//       port: 5432 
//     });
    const Pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.connect = async () => this.pool.connect();

    this.userTable = `
    CREATE TABLE IF NOT EXISTS user_table (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    password VARCHAR(120) NOT NULL
        );
        `;
    this.contactsTable = `
    CREATE TABLE IF NOT EXISTS contacts_table (
        id SERIAL PRIMARY KEY,
        email VARCHAR(120) NOT NULL UNIQUE,
        firstname VARCHAR(30) NOT NULL,
        othername VARCHAR(30) NOT NULL,
        lastname VARCHAR(30) NOT NULL
    );
    `;
    this.messagesTable = `
    CREATE TABLE IF NOT EXISTS messages_table (
        id SERIAL PRIMARY KEY,
        created_on DATE NOT NULL,    
        subject VARCHAR(60) NOT NULL,
        messages VARCHAR(128) NOT NULL,
        senderid INTEGER NOT NULL,
        receiverid INTEGER NOT NULL,
        parentMessageId UUID NOT NULL,
        status VARCHAR(30) NOT NULL
    );  
    `;
    this.sentTable = `
    CREATE TABLE IF NOT EXISTS sent_table(
        id SERIAL PRIMARY KEY,
        sender_id SERIAL REFERENCES user_table(id) ON DELETE CASCADE,
        message_id SERIAL REFERENCES messages_table (id) ON DELETE CASCADE,
        created_on DATE NOT NULL
    );
    `;
    this.inboxTable = `
    CREATE TABLE IF NOT EXISTS inbox_table (
     id SERIAL PRIMARY KEY,
      receiver_id SERIAL REFERENCES user_table (id) ON DELETE CASCADE,
      message_id SERIAL REFERENCES messages_table (id) ON DELETE CASCADE,
      created_on DATE NOT NULL
      
    )`;
    this.groupTable = `
    CREATE TABLE IF NOT EXISTS group_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        role VARCHAR(128) NOT NULL,
        ownerid SERIAL REFERENCES user_table (id) ON DELETE CASCADE
    );
    `;

    this.groupMembersTable = `
    CREATE TABLE IF NOT EXISTS members_table (
        id SERIAL PRIMARY KEY,
        groupid VARCHAR(128) NOT NULL,
        userid VARCHAR(128) NOT NULL,
        userole VARCHAR(128) NOT NULL
    );
    `;
    this.emailgroupTable = `
    CREATE TABLE IF NOT EXISTS emailgroup_table (
        id SERIAL PRIMARY KEY,
        created_on DATE NOT NULL,    
        subject VARCHAR(60) NOT NULL,
        messages VARCHAR(128) NOT NULL,
        parentMessageId INTEGER NOT NULL,
        status VARCHAR(30) NOT NULL,
        groupid SERIAL NOT NULL, 
        FOREIGN KEY (groupid) REFERENCES user_table(id) ON DELETE CASCADE
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
    await this.executeQuery(this.emailgroupTable);
  }
}
export default new Database();