import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private readonly logger = new Logger(RabbitMQService.name);

  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('order.notifications');
      this.logger.log('RabbitMQ connected');
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ', error);
    }
  }

  async send(queue: string, message: any) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    this.logger.log(`Message sent to ${queue}`);
  }
}

