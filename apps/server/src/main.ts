import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import MongooseClassSerializerInterceptor from './mongooseClassSerializer.interceptor';
import { Listing } from './schema/listing/listing.schema';
import { User } from './schema/user/user.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalInterceptors(new SanitizeMongooseModelInterceptor());

  await app.listen(3000);
}
bootstrap();
