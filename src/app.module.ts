import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { GroupsModule } from './groups/groups.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ExpensesModule } from './expenses/expenses.module';
import { QueryHelperModule } from './common/query-helper.module';
import { LoggingModule } from './logging/logging.module';
import { TraceMiddleware } from './logging/trace.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule, MailModule, GroupsModule, InvitationsModule, ExpensesModule, QueryHelperModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          ssl: {
            rejectUnauthorized: false, // Necesario para Neon
          },
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    LoggingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
