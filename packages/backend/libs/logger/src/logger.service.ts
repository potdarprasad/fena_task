
import { Injectable } from '@nestjs/common';
import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';

@Injectable()
export class LoggerService {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      },
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true, colors: { debug: 'cyan' } }),
            format.errors({ stack: true }),
            format.timestamp(),
            format.splat(),
            format.ms(),
            format.simple(),
          ),
        }),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ],
      exceptionHandlers: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true, colors: { debug: 'cyan' } }),
            format.errors({ stack: true }),
            format.timestamp(),
            format.splat(),
            format.ms(),
            format.simple(),
          ),
        }),
        new transports.File({ filename: 'exceptions.log' }),
      ],
      rejectionHandlers: [
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true, colors: { debug: 'cyan' } }),
            format.errors({ stack: true }),
            format.timestamp(),
            format.splat(),
            format.ms(),
            format.simple(),
          ),
        }),
        new transports.File({ filename: 'rejections.log' }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.log('info', message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.log('error', message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.log('warn', message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.log('debug', message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.log('verbose', message, { context });
  }
}