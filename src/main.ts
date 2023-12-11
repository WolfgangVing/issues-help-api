import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger("Main (main.ts)");
  const app = await NestFactory.create(AppModule)

  //Validate fields with help of class-validation decorators in the .dto.ts files
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Issues API")
    .setDescription("An api for bussines and services that offer solving problems by making tickets, which a operator would solve it.")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)
  
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get("PORT"))

  await app.listen(port);

  logger.log(`Server running on port ${port}`)
}
bootstrap();
