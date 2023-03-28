import { Exception } from '@COMMON/exception';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(_: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    httpAdapter.reply(
      ctx.getResponse(),
      Exception.UNKNOWN_ERROR.data,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
