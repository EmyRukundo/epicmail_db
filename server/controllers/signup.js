import joi from 'joi';
import Validation from '../helpers/validations';
import Helper from '../helpers/helpers';
import Database from '../db/db-connection';


const registerUser = (req, res) => {
  joi.validate(req.body, Validation.userSchema, Validation.validationOption).then((result) => {
    const newUser = [
      result.email,
      result.firstname,
      result.lastname,    
      Helper.hashPassword(result.password, 12),
    
     
    ];
    const sql = `INSERT INTO user_table (email, firstname, lastname, password)
     VALUES ($1,$2,$3,$4) RETURNING *`;

    const user = Database.executeQuery(sql, newUser);
    user.then((userResult) => {
        // console.log(userResult);
      if (userResult.rows.length) {
        return res.status(201).json({
          status: 201,
          data: userResult.rows,
        });
      }

      return res.status(400).json({
        status: 400,
        error: 'Failed to signup',
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: `Internal server Error ${error}`,
    }));
  }).catch(error => res.status(400).json({ status: 400, error: [...error.details] }));
};
export default registerUser;