import express, {Express, Request, Response} from 'express';
import aws from 'aws-sdk';

const app: Express = express();
const folder = process.env.PWD;
const port = 3000;

const awsConfig = {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1'
  };

  aws.config.update(awsConfig);

const sqs = new aws.SQS();

app.use(express.static(folder as string));
app.use(express.json());

app.post('/request_images', (req: Request, res: Response) => {
    const imagesSize = parseInt(req.body.size);
    console.log(imagesSize);
    
    for (let i = 0; i < imagesSize; i++) {
        sqs.sendMessage({
            MessageBody: "Gerar imagem",
            QueueUrl: ''
        },
        (err,data)=> {
            if(err){
                console.log('Error', err);
            }
            else{
                console.log('Success', data.MessageId);
                
            }
        }
        )
    }
    res.send('Request received');
    
})
app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})