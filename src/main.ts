import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);

  const { port } = config.get('server');

  app.enableCors();

  logger.debug(`Listening to port ${port}`);

  await app.listen(port);
}
bootstrap();
