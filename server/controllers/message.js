import Database from '../db/db-connection';
import Validation from '../helpers/validations';
import messages from'../models/message.js';
import joi from 'joi';


//@get all messages
const getMessages = async (req, res) => res.json({
    status: 200,
    data:await messages(),
  });


  //@Create message
  const createMessage = (req, res) => {
    joi.validate(req.body, Validation.messageSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message,
        });
      }
    //   const dayMonthYear = result.happeningOn.split('/');
    //   const date = new Date(dayMonthYear[2], dayMonthYear[1], dayMonthYear[0]);
      const newMessage = [
       
        new Date(),
        result.subject,
        result.message,
        result.status,
      ];
      const sql = 'INSERT INTO messages_table (created_on,subject,messages,status) VALUES ($1,$2,$3,$4) RETURNING *';
      const messageSql =Database.executeQuery(sql, newMessage);
      messageSql.then((insertedMessage) => {
        //   console.log(insertedMessage);
        if (insertedMessage.rows.length) {
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
          data: result.rows,
        });
      }
  
      return res.status(404).json({
        status: 404,
        error: 'No email found on this id',
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: `Internal server error ${error}`,
    }));
  };

  
  //@get a sent message
    
    const sentMessage = (req, res) => {
        const sql = `SELECT * FROM messages_table WHERE status = '${req.params.status}'`;
        const messageSql = Database.executeQuery(sql);
        messageSql.then((result) => {
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
    const sql = `SELECT * FROM messages_table WHERE status = '${req.params.status}'`;
    const messageSql = Database.executeQuery(sql);
    messageSql.then((result) => {
      if (result.rows.length) {
        return res.status(200).json({
          status: 200,
          data: result.rows,
        });
      }
  
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

const deleteEmail = (req, res) => {

    const id = req.params.id;
    Database.query("SELECT * FROM messages_table WHERE id=$1", [id],
      (error, result) => {
        if (error) {
        //console.log(error);
          return res.status(500).json(error);
        }
        if (result.rows.length === 0) {
          return res.status(400).json({ error: "Sorry! no message found on this id." });
        }
        //@delete if it is available
        pool.query("DELETE FROM messages_table WHERE id=$1", [id],
          (er, messageSql) => {
            if (er) {
              return res.status(500).json(er);
            }
            if (!messageSql) {
              return res.status(500).json({ error: "something went wrong try again later" });
            }
            return res.status(200).json({ success: true, message: "you deleted a message successfully." });
          });
      });
  };

    export{
        getMessages,createMessage,specificEmail,sentMessage,unreadMessage,deleteEmail
      };