// ─────────────────────────────────────────────────────────────
// Global HTTP Exception Filter
// Never exposes stack traces, DB errors, or internal paths
// in production. NODE_ENV check on every response.
// ─────────────────────────────────────────────────────────────

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

interface ErrorResponse {
  success: false;
  message: string;
  code: string | undefined;
  statusCode: number;
  timestamp: string;
  path: string;
  // Only included in development
  stack: string | undefined;
  details: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly isProd = process.env["NODE_ENV"] === "production";

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "An unexpected error occurred";
    let code: string | undefined;
    let details: unknown;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, unknown>;
        message =
          typeof resp["message"] === "string"
            ? resp["message"]
            : Array.isArray(resp["message"])
              ? (resp["message"] as string[]).join("; ")
              : message;
        code = typeof resp["code"] === "string" ? resp["code"] : undefined;
        details = !this.isProd ? resp["details"] : undefined;
      }
    } else if (exception instanceof Error) {
      // Log the full error server-side
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack
      );
      // In production, never expose internal details
      message = this.isProd
        ? "An internal server error occurred"
        : exception.message;
    }

    const errorBody: ErrorResponse = {
      success: false,
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack: this.isProd
        ? undefined
        : exception instanceof Error
          ? exception.stack
          : undefined,
      details: this.isProd ? undefined : details,
    };

    response.status(statusCode).json(errorBody);
  }
}
