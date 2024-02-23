import fs from 'fs';
import request from 'request';
import aws from 'aws-sdk'
import cron from 'node-cron';


const awsConfig = {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1'
  };

aws.config.update(awsConfig);

const sqs = new aws.SQS();

const generateImage = (fileName: string)=> {
    request('https://cataas.com/cat').pipe(
        fs.createWriteStream('images/' + fileName + '.jpg')
    )
}

const process = ()=> {
    sqs.receiveMessage(
        {
            MaxNumberOfMessages: 10,
            QueueUrl: '',
            WaitTimeSeconds: 5
        }, 
        (err, data)=> {
            if(err) {
                console.log(err)
            }else if(data.Messages){
                data.Messages.forEach(element=> {
                    generateImage(element.MessageId as string)
                    sqs.deleteMessage({
                        QueueUrl: '',
                        ReceiptHandle: element.ReceiptHandle as string
                    }, (err, data)=> {
                        if(err) {
                            console.log(err)
                        }else {
                            console.log('Mensagem deletada')
                        }
                    
                    })
                })
            }
        }
    )
}

cron.schedule('*/5 * * * * *', ()=> {
    console.log('processando');
    process();
})


