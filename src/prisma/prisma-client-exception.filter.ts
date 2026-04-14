import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & {
      requestId?: string;
      method?: string;
      url?: string;
    }>();

    const { code, meta } = exception;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string;

    switch (code) {
      case "P2002":
        statusCode = HttpStatus.CONFLICT;
        message = `Unique constraint failed on the field: ${(meta?.target as string[]).join(", ")}`;
        break;

      case "P2025":
        statusCode = HttpStatus.NOT_FOUND;
        message = "Record not found.";
        break;

      case "P2003":
        statusCode = HttpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        break;

      default:
        message = `Database error occurred (code: ${code})`;
        break;
    }

    this.logger.error(
      `${request.method ?? "UNKNOWN"} ${request.url ?? "UNKNOWN"} failed with Prisma error ${code} (${statusCode}) [requestId=${request.requestId ?? "n/a"}]: ${message}`,
      exception.stack,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      error: "PrismaClientKnownRequestError",
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.requestId ?? null,
    });
  }
}
