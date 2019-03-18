import dotenv from 'dotenv';
import getToken from '../helpers/functions';

dotenv.config();

const verifyToken = (req, res, next) => {
  // check if the token is not null
  if (getToken(req)) {
    const tokenData = getToken(req);

    // check if the token is verified
    if (tokenData) {
      next();
    } else { // when token validation failled
      return res.status(403).json({
        status: 403,
        error: 'Invalid username or password',
      });
    }
  } // when the token was not found
  else {
    return res.status(403).json({
      status: 403,
      error: 'Please log into your account first',
    });
  }
};
export default verifyToken;