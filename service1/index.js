const express = require('express'); 
const amqp = require('amqplib'); 

const app = express();
let connection, channel;
const queueName1 = 'service1-file-1';
const queueName2 = 'service1-file-2';

async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName1);
    await channel.assertQueue(queueName2);
}

connectToRabbitMQ();

app.post("/:id", (req, res) => {

    switch(req.params.id){
        case "1": 
            channel.sendToQueue(queueName1, Buffer.from("premier choix 1"));
        break;
        case "2": 
            channel.sendToQueue(queueName2, Buffer.from("premier choix 2"));
        break;
    }
})

app.listen(3000)