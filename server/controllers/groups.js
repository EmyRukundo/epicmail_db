import joi from 'joi';
import jsonWebToken from 'jsonwebtoken';
import Database from '../db/db-connection';
import Validation from '../helpers/validations';
import groups from'../models/groups.js';

//@get all messages
// const getGroups = async (req, res) => res.json({
//     status: 200,
//     data:await groups(),
//   });


  //@@ CREATE GROUP
  const createGroup = (req, res) => {
    joi.validate(req.body, Validation.groupSchema, Validation.validationOption, async (err, result) => {
      if (err) {
        return res.json({
          status: 400,
          error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
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

  const getGroups = (req, res) => {
   
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
        error:"you are not authorised to get any group",
      });
    }
    const sql = `SELECT * FROM group_table WHERE ownerid = '${userId}'`;
    const groupSql = Database.executeQuery(sql);
      
    groupSql.then((result) => {
console.log(result)
      if (result.rows.length) {

        return res.status(200).json({

          status: 200,
          data: result.rows
        });
      }
      return res.status(404).json({

        status: 404,
        error: 'No group with the given ID!',

      });
    }).catch(error => res.status(500).json({

      status: 500,
      error: `Internal server error ${error}`,

    }));
  };




  

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

 
//@UPDATE GROUP Name

  const updateGroup = (req, res) => {

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
        error:"you are not authorised to update any group",
      });
    }

    const checkGroupSql = `SELECT * FROM group_table WHERE ownerid='${userId}'`;
    const isAvailable = Database.executeQuery(checkGroupSql);
    isAvailable.then((isValid) => {
      if (isValid.rows) {
        if (isValid.rows.length) {
          joi.validate(req.body, Validation.updategroupSchema, Validation.validationOption, async (err, result) => {
            if (err) {
              return res.json({
                status: 400,
                error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
              });
            }
            
            
            let name = req.params.name;


              const sql = `UPDATE group_table SET name = '${name}' WHERE id = '${req.params.id}' RETURNING *`

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
            }).catch(error => res.status(400).json({ status: 400, error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,'')}));
        }
      }
    })
  };



// @@DELETE GROUP

const deleteGroup = async (req, res) => {

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
        error:" Oops,you are not authorised to delete any group!!",
      });
    }
    const checkGroupSql = `SELECT * FROM group_table WHERE ownerid='${userId}'`;
    const isAvailable = Database.executeQuery(checkGroupSql);
    isAvailable.then((isValid) => {
      if (isValid.rows) {
        if (isValid.rows.length) {
          
  const sql = `DELETE FROM group_table WHERE id = '${req.params.id}' RETURNING *`;

  Database.executeQuery(sql).then((result) => {
    
    res.status(202).json({ status:202,data:result.rows, message: "Deleted email successful" });
    
    

  }).catch(error => res.status(500).json({ status: 500, error: `Server error ${error}` }));
};
      }
})
}



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
  joi.validate(req.body, Validation.groupMemberSchema, Validation.validationOption, async (err, result) => {
    if (err) {
      return res.json({
        status: 400,
        error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
      });
    }
    const newMember = [
     
      result.groupid,
      result.userid,
      result.userole

    ];
    const sql = 'INSERT INTO members_table (groupid,userid,userole) VALUES ($1,$2,$3) RETURNING *';
    
    const memberSql = Database.executeQuery(sql, newMember);
    memberSql.then((insertedMember) => {    
      if (insertedMember.rows) {
        return res.status(200).json(
            {    
          status: 200,
          data: insertedMember.rows,

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
          error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
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
        error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
      });
    });
  };

    export{
        getGroups,createGroup,updateGroup,deleteGroup,groupMember,specificGroup,deleteMember,emailGroup
      };