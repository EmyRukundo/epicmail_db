import Database from '../db/db-connection';
import Validation from '../helpers/validation';
import groups from'../models/message.js';
import joi from 'joi';


//@get all messages
const getGroups = async (req, res) => res.json({
    status: 200,
    data:await groups(),
  });


  //@Create Group
  const createGroup = (req, res) => {
    joi.validate(req.body, Validation.groupSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message,
        });
      }
      const newGroup = [
        id,
        result.name,
        result.role  
       
      ];
      const sql = 'INSERT INTO group_table (id, name,role) VALUES ($1,$2,$3) RETURNING *';
      const groupSql =Database.executeQuery(sql, newGroup);
      groupSql.then((insertedGroup) => {
        if (insertedGroup.rows.length) {
          return res.status(200).json({
            status: 200,
            data: insertedGroup.rows,
          });
        }
  
        return res.status(400).json({
          status: 400,
          error: " Cant not create a group",
        });
      });
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        error: `Internal server error ${error}`,
      });
    });
  };

//UPDATE GROUP
const updateGroup = (req,res) => {
    const sql =` SELECT * FROM group_table WHERE id ='${req.params.id}' `;
    const groupSql = Database.executeQuery(sql);
    groupSql.then(() => {
        const sql =` INSERT * FROM group_table WHERE id ='${req.params.id}' `;
        
    })
}
// @DELETE GROUP

const deleteGroup = (req, res) => {

    const id = req.params.id;
    Database.query("SELECT * FROM group_table WHERE id=$1", [id],
      (error, result) => {
        if (error) {
        //console.log(error);
          return res.status(500).json(error);
        }
        if (result.rows.length === 0) {
          return res.status(400).json({ error: "Sorry! no group found on this id." });
        }
        //@delete if it is available
        pool.query("DELETE FROM group_table WHERE id=$1", [id],
          (er, groupSql) => {
            if (er) {
              return res.status(500).json(er);
            }
            if (!groupSql) {
              return res.status(500).json({ error: "something went wrong try again later" });
            }
            return res.status(200).json({ success: true, message: "you deleted a group successfully." });
          });
      });
  };


  //@Add a User to the group
  const groupMember = (req, res) => {
    joi.validate(req.body, Validation.groupMemberSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message,
        });
      }
      const newMember = [
        result.id,
        result.userId,
        result.userRole  
       
      ];
      const sql = 'INSERT INTO groupMember_table (id, name,role) VALUES ($1,$2,$3) RETURNING *';
      const groupSql =Database.executeQuery(sql, newMember);
      groupSql.then((insertedMember) => {
        if (insertedMember.rows.length) {
          return res.status(200).json({
            status: 200,
            data: insertedMember.rows,
          });
        }
  
        return res.status(400).json({
          status: 400,
          error: " Cant not add a User",
        });
      });
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        error: `Internal server error ${error}`,
      });
    });
  };


  // @DELETE A MEMBER OF A GROUP

const deleteGroup = (req, res) => {

    const id = req.params.id;
    Database.query("SELECT * FROM groupMember_table WHERE id=$1", [id],
      (error, result) => {
        if (error) {
        //console.log(error);
          return res.status(500).json(error);
        }
        if (result.rows.length === 0) {
          return res.status(400).json({ error: "Sorry! this member doesn't exist" });
        }
        //@delete if he/she is available
        pool.query("DELETE FROM groupMember_table WHERE id=$1", [id],
          (er, groupSql) => {
            if (er) {
              return res.status(500).json(er);
            }
            if (!groupSql) {
              return res.status(500).json({ error: "something went wrong try again later" });
            }
            return res.status(200).json({ success: true, message: "you deleted a group successfully." });
          });
      });
  };
  

  //@Create or send an ​email​ to a ​group 


  const EmailGroup = (req, res) => {
    joi.validate(req.body, Validation.messageSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message,
        });
      }
      const dayMonthYear = result.happeningOn.split('/');
      const date = new Date(dayMonthYear[2], dayMonthYear[1], dayMonthYear[0]);
      const newEmail = [
        id,
        new Date(),
        result.subject,
        result.message,
        result.senderId,
        result.receivedId,
        result.parentMessageId,
        result.status,
      ];
      const sql = 'INSERT INTO meesageGroup_table (id, created_on,subject,message,senderId,receiverId,parentMessageId,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
      const emailSql =Database.executeQuery(sql, newEmail);
      emailSql.then((insertedMessage) => {
        if (insertedEmail.rows.length) {
          return res.status(200).json({
            status: 200,
            data: insertedEmail.rows,
          });
        }
  
        return res.status(400).json({
          status: 400,
          error: " Cant not send Email to the group",
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
    const sql = `SELECT * FROM message_table WHERE id = '${req.params.id}'`;
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
        const sql = `SELECT * FROM message_table WHERE status = '${req.params.status}'`;
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
            error: 'No sent email found',
          });
        }).catch(error => res.status(500).json({
          status: 500,
          error: `Internal server error ${error}`,
        }));
      };


// @get unread Message

const unreadMessage = (req, res) => {
    const sql = `SELECT * FROM message_table WHERE status = '${req.params.status}'`;
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
    Database.query("SELECT * FROM message_table WHERE id=$1", [id],
      (error, result) => {
        if (error) {
        //console.log(error);
          return res.status(500).json(error);
        }
        if (result.rows.length === 0) {
          return res.status(400).json({ error: "Sorry! no message found on this id." });
        }
        //@delete if it is available
        pool.query("DELETE FROM meetup_table WHERE id=$1", [id],
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
        getGroups,createGroup,specificEmail,sentMessage,unreadMessage,deleteEmail
      };