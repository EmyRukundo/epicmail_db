import Database from '../db/connect';

const messages = async () => {
  const sql = 'SELECT * FROM meetup_table';
  const { rows } = await Database.executeQuery(sql);
  return [...rows];
};

export default messages;