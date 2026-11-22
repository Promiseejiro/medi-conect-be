import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Global()
@Module({ imports: [MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({
  uri: config.get<string>('MONGO_URI', 'mongodb://127.0.0.1:27017/mediconnect'),
  connectionFactory: (connection: Connection) => {
    const logger = new Logger('DatabaseModule');
    connection.on('connected', () => logger.log('MongoDB connected'));
    connection.on('error', (error) => logger.error(`MongoDB connection error: ${error.message}`));
    connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
    return connection;
  },
}) })], exports: [MongooseModule] })
export class DatabaseModule {}
