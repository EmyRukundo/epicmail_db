import users from '../models/users';
import Connection from '../db/db-connection';


const getUsers = async (req, res) => {
  if (users) {
    return res.json({
      status: 200,
      data:users,
    });
  }

  return res.json({
    status: 404,
    error: 'No users found',
  });
};
export default getUsers;
