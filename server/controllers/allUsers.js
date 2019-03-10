import users from '../models/users';
import Database from '../db/db-connection';


const getUsers = async (req, res) => {
  if (users) {
    return res.json({
      status: 200,
      data:users.rows,
    });
  }

  return res.json({
    status: 404,
    error: 'No users found',
  });
};
export default getUsers;
