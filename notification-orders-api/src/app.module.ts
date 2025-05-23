/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

import { Order } from './orders/entities/order.entity';
import { User } from './users/entities/user.entity';
import { LoggerMiddleware } from './logger/logger.middleware';
//import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ✅ Config global para variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Config async para TypeORM
    TypeOrmModule.forRootAsync ({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        retryDelay: 3000,
        synchronize: true, // ❗ Usar solo en desarrollo
      }),
    }),
    AuthModule,
    OrdersModule,
    UsersModule,
    RabbitMQModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Puedes cambiarlo a rutas específicas si prefieres
  }
}
//export class AppModule {}