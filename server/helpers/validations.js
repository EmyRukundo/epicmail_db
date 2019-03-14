import joi from 'joi';

const Validator = {
    
  userSchema: joi.object().keys({
    email: joi.string().email().required(),
    firstname: joi.string().regex(/^[a-zA-Z]/).min(2).required(),
    lastname: joi.string().regex(/^[a-zA-Z]/).min(2).required(),
    password: joi.string().min(6).required(),
    
  }),
  messageSchema: joi.object().keys({
    subject: joi.string().required(),
    messages: joi.string().required(),
    senderid: joi.string().required(),
    receiverid: joi.string().required(),
    parentmessageid: joi.string().required(),
    status: joi.string().required(),
    // parent_message_id: joi.string().required(),
    // ​status: joi.string().required()
  }),

  groupSchema: joi.object().keys({
    name: joi.string().required().min(4),
    role: joi.string().required().min(2),
    ownerid: joi.string().required(3)
  }),
 
  loginSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
  validationOption: {
    abortEarly: true,
    allowUnknown: false,
    stripUnknown: true,
  },
 
};
export default Validator; 