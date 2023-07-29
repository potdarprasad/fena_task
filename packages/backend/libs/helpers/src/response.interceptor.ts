import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => ({
              statusCode: context.switchToHttp().getResponse().statusCode,
              message: data.message,
              payload: data.data,
            })),
            catchError(error => {
                // Handle known exceptions
                if (error instanceof HttpException) {
                    throw error;
                }
                // Handle unknown exceptions
                const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error?.message || 'Internal Server Error';
                throw new HttpException({ status, message }, status);
            }),
        );
    }
}