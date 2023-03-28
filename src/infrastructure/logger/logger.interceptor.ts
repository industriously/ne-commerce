import { LoggerService } from '@nestjs/common';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { LoggerServiceToken } from './constants';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(LoggerServiceToken)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        this.logger.error(err, context.getClass().name);
        return throwError(() => err);
      }),
    );
  }
}
