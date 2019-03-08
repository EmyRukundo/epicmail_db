import jsonWebtoken from 'jsonwebtoken';

const getToken = (req) => {
    if(req.headers['authorization']){
       const token =  req.headers['authorization'].split(' ')[1];
       const tokenData = jsonWebtoken.verify(token,'secret');
       if(tokenData) {
           return tokenData;  
       }
       else{
           return false;
       }
    }
    else{
        return false;
    }
    }

export default getToken;
