import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // 自动移除未声明的属性
      transform: true,        // 自动类型转换
      forbidNonWhitelisted: true,
    }),
  )

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('贷后自助服务 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(3001)
  console.log('Backend running on http://localhost:3001')
  console.log('Swagger docs: http://localhost:3001/api/docs')
}

bootstrap()
