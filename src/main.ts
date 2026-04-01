import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as cookieParser from 'cookie-parser';
import * as yaml from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Middleware para cookies
  app.use(cookieParser());

  // Configuración de CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:5173'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Autenticación')
    .setDescription('API para manejar autenticación con Google')
    .setVersion('1.0.0')
    .setContact('Tu Nombre', 'https://tusitio.com', 'tu@email.com')
    .addServer('http://localhost:3001', 'Servidor local')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const orderedDocument = {
    openapi: document.openapi,
    info: document.info,
    servers: document.servers,
    tags: document.tags,
    paths: document.paths,
    components: document.components,
    security: document.security,
  };

  writeFileSync('./openapi.json', JSON.stringify(orderedDocument));
  const yamlContent = yaml.dump(orderedDocument, { noRefs: true });
  writeFileSync('./openapi.yaml', yamlContent); // 🔹 Aquí se guarda el YAM
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 Aplicación corriendo en ${await app.getUrl()}`);
  console.log('📜 Swagger disponible en /api');
}

bootstrap();
