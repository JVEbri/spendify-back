import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggingService implements LoggerService {
  private logger: winston.Logger;

  constructor(
    private configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    const isProduction = configService.get('NODE_ENV') === 'production';

    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  private getTraceId(): string {
    return this.cls.get('traceId') || 'no-trace-id';
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context, traceId: this.getTraceId() });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context, traceId: this.getTraceId() });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context, traceId: this.getTraceId() });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context, traceId: this.getTraceId() });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context, traceId: this.getTraceId() });
  }
}

