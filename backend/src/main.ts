import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { config, setupConfig } from './common';

async function bootstrap() {
  try {
    const error = await setupConfig();
    if (error) throw error;

    const app = await NestFactory.create(AppModule, { snapshot: true });
    app.enableCors();
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    const swaggarConfig = new DocumentBuilder()
      .setTitle('VAST API')
      .addBearerAuth({ type: 'http' }, 'jwt')
      .build();
    SwaggerModule.setup(
      '/api/documentation',
      app,
      SwaggerModule.createDocument(app, swaggarConfig),
      {
        swaggerOptions: { persistAuthorization: true }
      }
    );

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.PORT ?? 8080);

    if (config.NODE_ENV == 'development' || config.NODE_ENV == 'staging') {
      const link = config.BASE_URL;
      const docLink = `${link}/api/documentation`;
      console.log(`Vast Manager is running on: ${link}`);
      console.log(`Swagger documentation: ${docLink}`);
    }
  } catch (error) {
    console.error('Bootstrap failed:', error);
    process.exit(1);
  }
}
bootstrap();
