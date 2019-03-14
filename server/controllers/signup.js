import joi from 'joi';
import jsonWebToken from 'jsonwebtoken';
import Validation from '../helpers/validations';
import Helper from '../helpers/helpers';
import Database from '../db/db-connection';

 //@@ CREATE A NEW COUNT

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
        
        
      if (userResult.rows.length) {
     
     jsonWebToken.sign({user: userResult.rows }, 'secret',(err,token)=>{
      if(err){
     console.log(err);
      }else { 

        return res.status(201).json({
          status: 201,
          data: userResult.rows,token
        });
      }
    });


      }

      return res.status(400).json({
        status: 400,
        error: 'Failed to signup',
      });
    }).catch(error => res.status(400).json({
      status: 400,
      error: `Oops The user is already exist`,
    }));
  }).catch(error => res.status(400).json({
     status: 400, 
     error: error.details[0].message, 
    }));
};

export default registerUser;