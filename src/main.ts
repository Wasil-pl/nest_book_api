import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './shared/interceptors/logger.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  await app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
