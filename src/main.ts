import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger("Main (main.ts)");
  const app = await NestFactory.create(AppModule, {
    snapshot: true
  })

  //Validate fields with help of class-validation decorators in the .dto.ts files
  app.useGlobalPipes(new ValidationPipe());
  
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get("PORT"))

  await app.listen(port);

  logger.log(`Server running on port ${port}`)
}
bootstrap();
