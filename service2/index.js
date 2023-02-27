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

connectToRabbitMQ().then(() => {
    channel.consume(queueName1, (data) => {
        console.log("Message recu "+ queueName1 + " - " + data.content.toString());
        channel.ack(data);
    })

    channel.consume(queueName2, (data) => {
        console.log("Message recu "+ queueName2 + " - " + data.content.toString());
        channel.ack(data);
    })
})
