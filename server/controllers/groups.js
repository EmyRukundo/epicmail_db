import joi from 'joi';
import jsonWebToken from 'jsonwebtoken';
import Database from '../db/db-connection';
import Validation from '../helpers/validations';
import groups from'../models/groups.js';

//@get all groups
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

  //@get all groups owned by given user 
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
        error: 'You have not created any group!',

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
        error:"Sorry,you do not have a group, first create it!!",
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
            const name =req.body.name;

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
                  error: 'You do not own this group ',
                });
              }).catch(error => res.status(500).json({
                status: 500,
                error: `Internal server error ${error}`,
              }));
            }).catch(err => res.status(500).json({
               status: 500, 
               error:"Internal server error"
              }));
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
        error:" Oops,you are not authorised!!",
      });
    }
    const checkGroupSql = `SELECT * FROM group_table WHERE ownerid='${userId}'`;
    const isAvailable = Database.executeQuery(checkGroupSql);
    
    isAvailable.then((isValid) => {
      if(!isValid) res.status(404).send('The Email with the given ID was not found');
      if (isValid.rows) {
        if (isValid.rows.length) {
           
  const sql = `DELETE FROM group_table WHERE id = '${req.params.id}' and ownerid='${userId}' RETURNING *`;

  Database.executeQuery(sql).then((result) => {
    
    res.status(202).json({ status:202,data:result.rows, message: "Deleted group successful" });
    
  }).catch(error => res.status(500).json({ status: 500, error: `Server error ${error}` }));
};
      }
})
}

//@@ GET A SPECIFIC GROUP

// const specificGroup = (req, res) => {

// const sql = `SELECT * FROM group_table WHERE id = '${req.params.id}'`;

// const groupSql = Database.executeQuery(sql);

//   groupSql.then((result) => {

//     if (result.rows.length) {

//       return res.status(200).json({

//         status: 200,
//         data: result.rows
//       });
//     }
//     return res.status(404).json({

//       status: 404,
//       error: 'a group with given id was not found!',

//     });
//   }).catch(error => res.status(500).json({

//     status: 500,
//     error: `Internal server error ${error}`,

//   }));
// };

//@@ ADD USER TO THE GROUP

const groupMember = (req, res) => {

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
      error:"Oops, App does not known you!",
    });
  }

  const checkGroupSql = `SELECT * FROM group_table WHERE ownerid='${userId}'`;
  const isAvailable = Database.executeQuery(checkGroupSql);
  isAvailable.then((isValid) => {
    if (isValid.rows) {
      if (isValid.rows.length) {
        joi.validate(req.body, Validation.groupMemberSchema, Validation.validationOption, async (err, result) => {
          if (err) {
            return res.json({
              status: 400,
              error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
            });
          }    
          const member=[
            req.params.id,
            req.body.userId,
            req.body.userole
            
          ]
          const sql='INSERT INTO members_table (groupid,userid,userole) VALUES ($1,$2,$3) RETURNING *';
             

            const addMember = Database.executeQuery(sql,member);
            addMember.then((memberResult) => {
       console.log(memberResult.rows);
              if (memberResult.rows) {

                if (memberResult.rows.length) {

                  return res.status(201).json({
                    status: 201,
                    data: memberResult.rows,
                  });
                }
              }
              return res.status(400).json({
                status: 400,
                error: 'You do not own this group ',
              });
            }).catch(error => res.status(500).json({
              status: 500,
              error: `Internal server error ${error}`,
            }));
          }).catch(err => res.status(500).json({
             status: 500, 
             error:"Internal server error"
            }));
      }
    }
  })
};




 

//  const groupMember = (req, res) => {
//   joi.validate(req.body, Validation.groupMemberSchema, Validation.validationOption, async (err, result) => {
//     if (err) {
//       return res.json({
//         status: 400,
//         error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
//       });
//     }
//     const newMember = [
     
//       result.groupid,
//       result.userid,
//       result.userole

//     ];
//     const sql = 'INSERT INTO members_table (groupid,userid,userole) VALUES ($1,$2,$3) RETURNING *';
    
//     const memberSql = Database.executeQuery(sql, newMember);
//     memberSql.then((insertedMember) => {    
//       if (insertedMember.rows) {
//         return res.status(200).json(
//             {    
//           status: 200,
//           data: insertedMember.rows,

//         });
//       }

//       return res.status(400).json({
//         status: 400,
//         error: " Cant not save data in the database",
//       });
//     });
//   }).catch((error) => {
//     res.status(500).json({
//       status: 500,
//       error: `Internal server error ${error}`,
//     });
//   });
// };

  // @DELETE A MEMBER FROM A SPECIFIC GROUP

  const deleteMember = async (req, res) => {
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
      const checkGroupSql = `SELECT * FROM group_table WHERE ownerid='${userId}'`;
      const isAvailable = Database.executeQuery(checkGroupSql);
      
      isAvailable.then((isValid) => {      
        if (isValid.rows) {
          if (isValid.rows.length) {
             
    const sql = `DELETE FROM members_table WHERE groupid='${req.params.groupid}' and userid='${req.params.id}' RETURNING *`;
  
    Database.executeQuery(sql).then((result) => {
      
      res.status(202).json({ status:202,data:result.rows, message: "Deleted user successful" });
      
    }).catch(error => res.status(500).json({ status: 500, error: `Server error ${error}` }));
  };
        }
  }).catch(error => res.status(500).json({ status: 500, error: ` error ${error}` }));
  }

  //@Create or send an ​email​ to a ​group 

  // const emailGroup = (req, res) => {
    

  //     joi.validate(req.body, Validation.emailgroupSchema, Validation.validationOption, async (err, result) => {
  //       if (err) {
  //         return res.json({
  //           status: 400,
  //           error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
  //         });
  //       }
  
  //       let token = 0;
  //     let decodedToken = '';
  //     let userId = '';
  //     if (req.headers.authorization) {
  //       token = req.headers.authorization.split(' ')[1];
  //       decodedToken = jsonWebToken.verify(token, 'secret');
  //       userId = decodedToken.user[0].id;
  //     } else {
  //       return res.status(403).json({
  //         status: 403,
  //         error:"you are not authorised to send an email to the group",
  //       });
  //     }
  
  //       const newEmail = [
  //       new Date(),
  //       result.subject,
  //       result.message,
  //       result.parentMessageId,
  //       result.status,
  //       req.params.id
  //     ];
  //     const sql = 'INSERT INTO emailgroup_table (created_on,subject,message,parentMessageId,status,groupid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
  //     const emailSql =Database.executeQuery(sql, newEmail);    
  //       emailSql.then((emailResult) => {
  //         if (emailResult.rows.length!==0) {
  //           return res.status(201).json({
  //             status: 201,
  //             data: emailResult.rows,
  //           });
  //         }
  //         return res.status(400).json({
  //           status: 400,
  //           error: 'Email could not be sent',
  //         });
  //       }).catch(error => res.status(500).json({
  //         status: 500,
  //         error: `Internal server error ${error}`,
  //       }));
  //     }).catch((error) => {
  //       res.status(500).json({
  //         status: 500,
  //         error: `Internal server error ${error}`,
  //       });
  //     });
    
  // };
//@@ send email to the group

  const emailGroup = (req, res) => {

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
        error:"Sorry,you can not send an email to the group",
      });
    }
    const checkGroupSql = `SELECT * FROM group_table WHERE id='${req.params.id}'`;
    const isAvailable = Database.executeQuery(checkGroupSql);
    isAvailable.then((isValid) => {
      if (isValid.rows) {
        if (isValid.rows.length) {
          joi.validate(req.body, Validation.emailgroupSchema, Validation.validationOption, async (err, result) => {
            if (err) {
              return res.json({
                status: 400,
                error: err.details[0].message.replace(/[$\/\\#,+()$~%.'":*<>{}]/g,''),
              });
            }    
            const newEmail = [
              new Date(),
              result.subject,
              result.message,
              result.parentMessageId,
              result.status,
              req.params.id
            ];
            const sql = 'INSERT INTO emailgroup_table (created_on,subject,message,parentMessageId,status,groupid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
            const emailSql =Database.executeQuery(sql, newEmail); 
              emailSql.then((sendEmailResult) => {

                if (sendEmailResult.rows) {
                     
                  if (sendEmailResult.rows) {
                    console.log(sendEmailResult.rows);
                    return res.status(201).json({
                      status: 201,
                      data: sendEmailResult.rows,
                    });
                  }
                }
                return res.status(400).json({
                  status: 400,
                  error: 'You are not part of this group ',
                });
              }).catch(error => res.status(500).json({
                status: 500,
                error: `Internal server error ${error}`,
              }));
            }).catch(err => res.status(500).json({
               status: 500, 
               error:`Internal server error ${error}`,
              }));
        }
      }
    })
  };




    export{
        getGroups,createGroup,updateGroup,deleteGroup,groupMember,specificGroup,deleteMember,emailGroup
      };