import dotenv from 'dotenv';
dotenv.config();

const rabbitConfig = {
  RMQ_USER: process.env.RMQ_USER,
  RMQ_PASSWORD: process.env.RMQ_PASSWORD,
  RMQ_HOST: process.env.RMQ_HOST,
  RMQ_PORT: process.env.RMQ_PORT,
};

export const rabbitURI = `amqp://${rabbitConfig.RMQ_USER}:${rabbitConfig.RMQ_PASSWORD}@${rabbitConfig.RMQ_HOST}:${rabbitConfig.RMQ_PORT}`

