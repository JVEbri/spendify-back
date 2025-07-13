import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('traceId', req['traceId']);
        },
      },
    }),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}

