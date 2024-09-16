import { connect } from "amqplib";

 const queue = 'lista-bloqueados'

export default class RabbitmqServer {
    constructor(uri) {
      this.uri = uri;
    }

    async start() {
        this.conn = await connect(this.uri);
        this.channel = await this.conn.createChannel();
      }

    async consume(queue) {
        this.channel.assertQueue(queue, {
          durable: true,
    })
}

    async envioListaBloqueados (message) {
        //console.log("Mensagem :", message);
        return this.channel.sendToQueue(queue, Buffer.from(message))
       
    }
 }