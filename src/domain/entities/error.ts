export type ErrorKey =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  constructor(
    public code: ErrorKey,
    public statusCode: number = 400,
    public metadata?: Record<string, unknown>,
    message?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ServerError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("INTERNAL_SERVER_ERROR", 500, metadata, message);
    this.name = "ServerError";
  }
}

export class NotFoundError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("NOT_FOUND", 404, metadata, message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("UNAUTHORIZED", 401, metadata, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("FORBIDDEN", 403, metadata, message);
    this.name = "ForbiddenError";
  }
}

export class BadRequestError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("BAD_REQUEST", 400, metadata, message);
    this.name = "BadRequestError";
  }
}
