import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './server/routes/users';
import messageRouter from './server/routes/message';
import specificRouter from './server/routes/specificEmail';
import deleteRouter from './server/routes/deleteMessage';
import groupsRouter from './server/routes/groups';
import Database from './server/db/db-connection';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/messages',specificRouter);
app.use('/api/v1/auth/',userRouter);
app.use('/api/v1/',messageRouter);
app.use('/api/v1/messages',deleteRouter);
app.use('/api/V1/',groupsRouter);

app.get('/',(req,res)=>{

	res.status(202).send('Welcome to the EPIC Mail web app');
});

app.get('/*',(req,res)=>{

	res.status(404).send('This is not the page you are looking for');
});

app.get((err,req,res,next) => {
					  
	res.status(404).send('This is not the page you are looking for');
});



const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));

export default app;
