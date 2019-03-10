import Database from '../db/db-connection';
import Validation from '../helpers/validations';
import groups from'../models/groups.js';
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
        result.id,
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

  
//@UPDATE GROUP Name

  const updateGroup = (req, res) => {
    const checkGroupSql = `SELECT * FROM group_table WHERE id  = '${req.params.id}'`;
    const isAvailable = Database.executeQuery(checkGroupSql);
    isAvailable.then((isValid) => {
      if (isValid.rows) {
        if (isValid.rows.length) {
          joi.validate(req.body, Validation.groupSchema, Validation.validationOption)
            .then((result) => {
              let token = 0;
              let decodedToken = '';
              let userId = '';
              if (req.headers.authorization) {
              // eslint-disable-next-line prefer-destructuring
                token = req.headers.authorization.split(' ')[1];
                decodedToken = jsonWebToken.verify(token, process.env.SECRETKEY);
                userId = decodedToken.user[0].id;
              } else {
                return res.sendStatus(403);
              }

              const sql = `UPDATE group_table SET name = '${name}' WHERE group_id = '${req.params.id}' RETURNING *`

              const editName = Database.executeQuery(sql);
              editName.then((updatenameResult) => {
                if (updatenameResult.rows) {
                  if (updatenameResult.rows.length) {
                    return res.status(201).json({
                      status: 201,
                      data: updatenameResult.rows,
                    });
                  }
                }
  
                return res.status(400).json({
                  status: 400,
                  error: 'Cannot update a group name',
                });
              }).catch(error => res.status(500).json({
                status: 500,
                error: `Internal server error ${error}`,
              }));
            }).catch(error => res.status(400).json({ status: 400, error: [...error.details] }));
        }
      }
    })
  };



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
    const checkgroupSql = `SELECT * FROM group_table WHERE id  = '${req.params.id}'`;
    const isAvailable = Database.executeQuery(checkgroupSql);
    isAvailable.then((isValid) => {
      if (isValid.rows) {
        if (isValid.rows.length) {
          joi.validate(req.body, Validation.groupSchema, Validation.validationOption)
            .then((result) => {
              let token = 0;
              let decodedToken = '';
              let userId = '';
              if (req.headers.authorization) {
              // eslint-disable-next-line prefer-destructuring
                token = req.headers.authorization.split(' ')[1];
                decodedToken = jsonWebToken.verify(token, process.env.SECRETKEY);
                userId = decodedToken.user[0].id;
              } else {
                return res.sendStatus(403);
              }
              const newMember = [
                // ​ id,
                // result.userId,  
                //  ​result.userRole,
              ];
              const sql = `INSERT INTO member_table (id,userId,userRole)
           VALUES ($1,$2,$3) RETURNING *`;
              const user = Database.executeQuery(sql, newMember);
              user.then((userResult) => {
                if (userResult.rows) {
                  if (userResult.rows.length) {
                    return res.status(201).json({
                      status: 201,
                      data: userResult.rows,
                    });
                  }
                }
  
                return res.status(400).json({
                  status: 400,
                  error: 'user could not be created',
                });
              }).catch(error => res.status(500).json({
                status: 500,
                error: `Internal server error ${error}`,
              }));
            }).catch(error => res.status(400).json({ status: 400, error: [...error.details] }));
        }
      } else {
        return res.status(400)
          .json({ status: 400, error: 'Error : can not create user to a non existing group' });
      }
    }).catch(error => res.status(500).json({ status: 500, error: `Server error: ${error}` }));
  };
  



  // @DELETE A MEMBER OF A GROUP

const deleteMember = (req, res) => {

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

  const emailGroup = (req, res) => {
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
        result.id,
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



    export{
        getGroups,createGroup,updateGroup,deleteGroup,groupMember,deleteMember,emailGroup
      };