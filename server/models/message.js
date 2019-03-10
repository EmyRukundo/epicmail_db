import Database from '../db/db-connection';

const messages = async () => {
  const sql = 'SELECT * FROM messages_table';
  const { rows } = await Database.executeQuery(sql);
  return [...rows];
  
};

export default messages;