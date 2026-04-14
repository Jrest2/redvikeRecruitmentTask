import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  private message: string = "Internal Server Error";

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const { code, meta } = exception;

    console.log("Prisma Error : ----- ", exception);

    switch (code) {
      case "P2002": // Unique constraint failed
        this.statusCode = HttpStatus.CONFLICT;
        this.message = `Unique constraint failed on the field: ${(meta?.target as string[]).join(", ")}`;
        break;

      case "P2025": // Record not found
        this.statusCode = HttpStatus.NOT_FOUND;
        this.message = `Record not found.`;
        break;

      case "P2003": // Foreign key constraint failed
        this.statusCode = HttpStatus.BAD_REQUEST;
        this.message = `Foreign key constraint failed.`;
        break;

      default:
        this.message = `Database error occurred (code: ${code})`;
        break;
    }

    response.status(this.statusCode).json({
      statusCode: this.statusCode,
      message: this.message,
      error: "PrismaClientKnownRequestError",
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.requestId ?? null,
    });
  }
}
