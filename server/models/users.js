;import Database from '../db/db-connection';

const selectFrom = async (tableName, id = false) => {
  
  const sql = `SELECT * FROM user_table;`
  return Database.executeQuery(sql);
};

export default selectFrom;