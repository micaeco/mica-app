import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export type ErrorKey =
  | "TAG_ALREADY_EXISTS"
  | "TAG_NOT_FOUND"
  | "SENSOR_NOT_FOUND"
  | "HOUSEHOLD_SENSOR_ALREADY_EXISTS"
  | "HOUSEHOLD_INVITATION_ALREADY_EXISTS"
  | "HOUSEHOLD_INVITATION_INVALID"
  | "HOUSEHOLD_USER_ALREADY_EXISTS"
  | "ADMIN_HOUSEHOLD_USER_CANNOT_LEAVE"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  constructor(
    public code: ErrorKey,
    public httpStatusCode: number = 400,
    public trpcCode: TRPC_ERROR_CODE_KEY = "BAD_REQUEST",
    public metadata?: Record<string, unknown>,
    message?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class SensorNotFoundError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("SENSOR_NOT_FOUND", 404, "NOT_FOUND", metadata, message);
    this.name = "SensorNotFoundError";
  }
}

export class HouseholdSensorAlreadyExistsError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("HOUSEHOLD_SENSOR_ALREADY_EXISTS", 409, "CONFLICT", metadata, message);
    this.name = "HouseholdSensorAlreadyExistsError";
  }
}
export class TagAlreadyExistsError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("TAG_ALREADY_EXISTS", 409, "CONFLICT", metadata, message);
    this.name = "TagAlreadyExistsError";
  }
}

export class TagNotFoundError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("TAG_NOT_FOUND", 404, "NOT_FOUND", metadata, message);
    this.name = "TagNotFoundError";
  }
}

export class HouseholdInvitationAlreadyExistsError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("HOUSEHOLD_INVITATION_ALREADY_EXISTS", 409, "CONFLICT", metadata, message);
    this.name = "HouseholdInvitationAlreadyExistsError";
  }
}

export class HouseholdInvitationInvalidError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("HOUSEHOLD_INVITATION_INVALID", 410, "BAD_REQUEST", metadata, message);
    this.name = "HouseholdInvitationInvalidError";
  }
}

export class HouseholdUserAlreadyExistsError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("HOUSEHOLD_USER_ALREADY_EXISTS", 409, "CONFLICT", metadata, message);
    this.name = "HouseholdUserAlreadyExistsError";
  }
}

export class AdminHouseholdUserCannotLeaveError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("ADMIN_HOUSEHOLD_USER_CANNOT_LEAVE", 403, "FORBIDDEN", metadata, message);
    this.name = "AdminHouseholdUserCannotLeaveError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(metadata?: Record<string, unknown>, message = "Unauthorized") {
    super("UNAUTHORIZED", 401, "UNAUTHORIZED", metadata, message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource?: string, metadata?: Record<string, unknown>, message?: string) {
    const errorMessage = message || (resource ? `${resource} not found` : "Resource not found");
    super("NOT_FOUND", 404, "NOT_FOUND", { ...metadata, resource }, errorMessage);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends AppError {
  constructor(metadata?: Record<string, unknown>, message = "Bad request") {
    super("BAD_REQUEST", 400, "BAD_REQUEST", metadata, message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends AppError {
  constructor(metadata?: Record<string, unknown>, message = "Internal server error") {
    super("INTERNAL_SERVER_ERROR", 500, "INTERNAL_SERVER_ERROR", metadata, message);
    this.name = "InternalServerError";
  }
}
