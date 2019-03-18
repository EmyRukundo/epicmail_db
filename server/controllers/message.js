import joi from 'joi';
import jsonWebToken from 'jsonwebtoken';
import Database from '../db/db-connection';
import Validation from '../helpers/validations';
import messages from'../models/message.js';
import uuid from 'uuid';

//@@get all messages

const getMessages = async (req, res) => {
 
res.status(200).json({    
          status: 200,
          data:await messages(),
  });
}

  //@@Create message

  
  const createMessage = (req, res) => {
    let token = 0;
    let decodedToken = '';
    let userId = '';
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
      decodedToken = jsonWebToken.verify(token, 'secret');
      userId = decodedToken.user[0].id;
    } else {
      return res.status(403).json({
        status: 403,
        error:" Oops,you are not authorised!!",
      });
    }
    joi.validate(req.body, Validation.messageSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
        });
      }
      const newMessage = [
        new Date(),
        result.subject,
        result.messages,
        userId, //senderId
        result.receiverid, //receiverid
        uuid(),
        result.status
      ];
      const sql = `INSERT INTO messages_table(created_on,subject,messages,senderid,receiverid,parentmessageid,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
      
      const messageSql = Database.executeQuery(sql, newMessage);
      console.log(messageSql.rows);
      messageSql.then((insertedMessage) => {   
      
        if (insertedMessage.rows) {
          return res.status(200).json(
              {    
            status: 200,
            data: insertedMessage.rows,

          });
        }
  
        return res.status(400).json({
          status: 400,
          error: " Cant not save data in the database",
        });
      });
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        error: `Internal server error ${error}`,
      });
    });
  };
  
//@get a specific Email

  const specificEmail = (req, res) => {

  
    const sql = `SELECT * FROM messages_table WHERE id = '${req.params.id}'`;

    const messageSql = Database.executeQuery(sql);

    messageSql.then((result) => {

      if (result.rows.length) {

        return res.status(200).json({

          status: 200,
          data: result.rows
        });
      }
      return res.status(404).json({

        status: 404,
        error: 'No email found on given id ',

      });
    }).catch(error => res.status(500).json({

      status: 500,
      error: `Internal server error ${error}`,

    }));
  };

  
  //@get a sent message
    
    const sentMessage = (req, res) => {
          
      let token = 0;
      let decodedToken = '';
      let userId = '';
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        decodedToken = jsonWebToken.verify(token, 'secret');
        userId = decodedToken.user[0].id;
      } else {
        return res.status(403).json({
          status: 403,
          error:" Oops,you are not authorised!!",
        });
      } 
        const sql = "SELECT * FROM messages_table WHERE status =$1"; 
        const messageSql = Database.executeQuery(sql);
        console.log(messageSql.rows);
        messageSql.then((result) => {
          console.log(result.rows);
          if (result.rows.length) {

            return res.status(200).json({
              status: 200,
              data: result.rows,
            });
          }
      
          return res.status(404).json({
            status: 400,
            error: 'No sent email found',
          });
        }).catch(error => res.status(500).json({
          status: 500,
          error: `Internal server error ${error}`,
        }));
      };


// @get unread Message

const unreadMessage = (req, res) => {

  let token = 0;
  let decodedToken = '';
  let userId = '';
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
    decodedToken = jsonWebToken.verify(token, 'secret');
    userId = decodedToken.user[0].id;
  } else {
    return res.status(403).json({
      status: 403,
      error:" Oops,you are not authorised!!",
    });
  }

    const sql =" SELECT * FROM messages_table WHERE status LIKE 's%' ";
    const messageSql = Database.executeQuery(sql);

   
    messageSql.then((result) => {
      console.log(result);
      if (result) {
        console.log(result);
        return res.status(200).send({
          status: 200,
          data: result.rows,
        });
      }
      console.log(result);
      return res.status(404).json({
        status: 400,
        error: 'No unread email found',
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: `Internal server error ${error}`,
    }));
  };


 //@deleteEmail
  
 const deleteEmail = async (req, res) => {
  let token = 0;
  let decodedToken = '';
  let userId = '';
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
    decodedToken = jsonWebToken.verify(token, 'secret');
    userId = decodedToken.user[0].id;
  } else {
    return res.status(403).json({
      status: 403,
      error:" Oops,you are not authorised!!",
    });
  }

  const sql = `DELETE FROM messages_table WHERE id = '${req.params.id}' RETURNING *`;

  Database.executeQuery(sql).then((result) => {

    res.status(202).json({ status: 202, message: "Deleted email successful" });
    
    

  }).catch(error => res.status(500).json({ status: 500, error: `Server error ${error}` }));
};


// const deleteEmail = (req, res) => {

//     const id = req.params.id;
//     Database.executeQuery("SELECT * FROM messages_table WHERE id=$1", [id],
//       (error, result) => {
//         if (error) {
//         //console.log(error);
//           return res.status(400).json(error);
//         }
//         if (result.rows.length === 0) {
//           return res.status(400).json({ error: "Sorry! no message found on this id." });
//         }
//         //@delete if it is available
//         pool.executeQuery("DELETE FROM messages_table WHERE id=$1", [id],
//           (er, messageSql) => {
//             if (er) {
//               return res.status(500).json(er);
//             }
//             if (!messageSql) {
//               return res.status(500).json({ error: "something went wrong try again later" });
//             }
//             return res.status(200).json({ success: true, message: "you deleted a message successfully." });
//           });
//       });
//   };

    export{
        getMessages,createMessage,specificEmail,sentMessage,unreadMessage,deleteEmail
      };