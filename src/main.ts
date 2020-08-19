import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: { origin: false, methods: ['GET','POST','PUT','DELETE','OPTIONS']}});

  const { port } = config.get('server');

  await app.listen(port);
}
bootstrap();
