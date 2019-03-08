import Database from '../db/db-connection';

const groups = async () => {
  const sql = 'SELECT * FROM group_table';
  const { rows } = await Database.executeQuery(sql);
  return [...rows];
};

export default groups;