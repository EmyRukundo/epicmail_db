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
    receiverid: joi.number().integer().required(),
    status: joi.string().required(),
  }),

  groupSchema: joi.object().keys({
    name: joi.string().required().min(4),
    role: joi.string().required().min(2),
   
  }),
  updategroupSchema: joi.object().keys({
    name: joi.string().required().min(4),
  }),
 
  loginSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
  
  groupMemberSchema: joi.object().keys({
    userid: joi.number().integer().required(),
    userole: joi.string().required(),
    
  }),
  emailgroupSchema: joi.object().keys({
    subject: joi.string().required(),
    message: joi.string().required(), 
    status: joi.string().required(),
  }),
  validationOption: {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  },
 
};
export default Validator; 