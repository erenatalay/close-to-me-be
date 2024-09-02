import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const error = exception as { response: { errors: Error } };

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An error occurred, please try again later';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else {
      this.logger.error(
        `Unexpected error: ${exception}`,
        (exception as Error).stack,
      );
    }
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: error.response.errors,
      message,
      ...(isDevelopment && { stack: (exception as Error).stack }),
      ...(isDevelopment && {
        error: exception instanceof HttpException ? exception?.name : 'Error',
      }),
    };

    response.status(status).json(errorResponse);
  }
}
