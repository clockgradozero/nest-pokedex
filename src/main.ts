import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({ 

      /*El whitelist solo deja las params que se utilizan en el DTO*/
      whitelist: true, 

      /*Prohibe enviar params que no se necesitan, e invalida la peticion*/
      forbidNonWhitelisted: true, 
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
