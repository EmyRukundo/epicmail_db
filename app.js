import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './server/routes/users';
import messageRouter from './server/routes/message';
import specificRouter from './server/routes/specificEmail';
import deleteRouter from './server/routes/deleteMessage';
import groupsRouter from './server/routes/groups';
import swagger from 'swagger-ui-express';
import yamljs from 'yamljs';

const swaggerDocumment = yamljs.load('server/swagger/document.yml');

const app = express();
app.use('/doc',swagger.serve, swagger.setup(swaggerDocumment));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v2/messages',specificRouter);
app.use('/api/v2/auth/',userRouter);
app.use('/api/v2/',messageRouter);
app.use('/api/v2/messages',deleteRouter);
app.use('/api/V2/',groupsRouter);

app.get('/',(req,res)=>{

	res.status(202).send('Welcome to the EPIC Mail web app');
});

app.get('/*',(req,res)=>{

});

app.get((err,req,res,next) => {
					  
	res.status(404).send('This is not the page you are looking for');
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));

export default app;