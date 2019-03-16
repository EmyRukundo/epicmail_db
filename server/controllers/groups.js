import joi from 'joi';
import jsonWebToken from 'jsonwebtoken';
import Database from '../db/db-connection';
import Validation from '../helpers/validations';
import groups from'../models/groups.js';

//@get all messages
const getGroups = async (req, res) => res.json({
    status: 200,
    data:await groups(),
  });


  //@Create Groupg
  const createGroup = (req, res) => {
    joi.validate(req.body, Validation.groupSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message,
        });
      }

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
        error:"you are not authorised to create a group",
      });
    }



    //   if (err) {
    //     return res.json({
    //       status: 400,
    //       error: err.details[0].message,
    //     });
    // }

      const newGroup = [
       
        result.name,
        result.role,
        userId,
    
      ];
      const sql = 'INSERT INTO group_table (name,role,ownerid) VALUES ($1,$2,$3) RETURNING *';
      const groupSql =Database.executeQuery(sql, newGroup);
      
      groupSql.then((groupResult) => {
        if (groupResult.rows.length!==0) {
          return res.status(201).json({
            status: 201,
            data: groupResult.rows,
          });
        }
        return res.status(400).json({
          status: 400,
          error: 'Group could not be created',
        });
      }).catch(error => res.status(500).json({
        status: 500,
        error: `Internal server error ${error}`,
      }));
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        error: `Internal server error ${error}`,
      });
    });
  };
  


  //     groupSql.then((insertedGroup) => {

  //       const ownerSql ='SELECT * FROM user_table where ownerid =$id';
  //       const groupSql =Database.executeQuery(ownerSql, checkSql);
        
  //       if (insertedGroup.rows.length) {
  //         return res.status(200).json({
  //           status: 200,
  //           data: insertedGroup.rows,
  //         });
  //       }
  
  //       return res.status(400).json({
  //         status: 400,
  //         error: " Cant not create a group",
  //       });
  //     });
  //   }).catch((error) => {
  //     res.status(500).json({
  //       status: 500,
  //       error: `Internal server error ${error}`,
  //     });
  //   });
  // };

  //@GET SPECIFIC GROUP

  const specificGroup = (req, res) => {

    const sql = `SELECT * FROM group_table WHERE id = '${req.params.id}'`;

    const groupSql = Database.executeQuery(sql);

    groupSql.then((result) => {

      if (result.rows.length) {

        return res.status(200).json({

          status: 200,
          data: result.rows
        });
      }
      return res.status(404).json({

        status: 404,
        error: 'a group with given id was not found!',

      });
    }).catch(error => res.status(500).json({

      status: 500,
      error: `Internal server error ${error}`,

    }));
  };
//@ Get all groups owned by specific id

// const  groupsOwned =(req, res) => {
//   const groupsOwnedSql = 'SELECT * FROM group_table WHERE ownerid = $1';
//   try {
//     const { rows } = await pool.query(groupsOwnedSql, [req.user.id]);
//     if (rows.length > 0) {
//       let messages = [];
//       rows.forEach(message => {
//         messages.push(message);
//       });
//       return res.status(200).json({
//         status: 200,
//         data: messages,
//       });
//     }
//     return res.status(400).json({
//       status: 400,
//       error: 'You have no groups',
//     });
//   } catch(error) {
//     return res.status(400).send(error);
//   }
// },







  
//@UPDATE GROUP Name

  const updateGroup = (req, res) => {

    const checkGroupSql = `SELECT * FROM group_table WHERE id  = '${req.params.id}'`;
    const isAvailable = Database.executeQuery(checkGroupSql);
    isAvailable.then((isValid) => {
      if (isValid.rows) {
        if (isValid.rows.length) {
          // joi.validate(req.body, Validation.groupSchema, Validation.validationOption)
          //   .then((result) => {

              // let token = 0;
              // let decodedToken = '';
              // let userId = '';
          /*    if (req.headers.authorization) {
              // eslint-disable-next-line prefer-destructuring
                token = req.headers.authorization.split(' ')[1];
                decodedToken = jsonWebToken.verify(token, process.env.SECRETKEY);
                userId = decodedToken.user[0].id;
              } else {
                return res.sendStatus(403);
              }
              */

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
            // }).catch(error => res.status(400).json({ status: 400, error: [...error.details] }));
        }
      }
    })
  };



// @DELETE GROUP

const deleteGroup = async (req, res) => {

  const sql = `DELETE FROM group_table WHERE id = '${req.params.id}' RETURNING *`;

  Database.executeQuery(sql).then((result) => {


    res.status(202).json({ status: 202, message: "Deleted email successful" });
    
    // };

  }).catch(error => res.status(500).json({ status: 500, error: `Server error ${error}` }));
};




// const deleteGroup = (req, res) => {

//     const id = req.params.id;
//     Database.executeQuery("SELECT * FROM group_table WHERE id=$1", [id],
//       (error, result) => {
//         if (error) {
//         //console.log(error);
//           return res.status(500).json(error);
//         }
//         if (result.rows.length === 0) {
//           return res.status(400).json({ error: "Sorry! no group found on this id." });
//         }
//         //@delete if it is available
//         pool.query("DELETE FROM group_table WHERE id=$1", [id],
//           (er, groupSql) => {
//             if (er) {
//               return res.status(500).json(er);
//             }
//             if (!groupSql) {
//               return res.status(500).json({ error: "something went wrong try again later" });
//             }
//             return res.status(200).json({ success: true, message: "you deleted a group successfully." });
//           });
//       });
//   };


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
        getGroups,createGroup,updateGroup,deleteGroup,groupMember,specificGroup,deleteMember,emailGroup
      };