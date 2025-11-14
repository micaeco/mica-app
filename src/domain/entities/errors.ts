import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export type ErrorKey =
  | "TAG_ALREADY_EXISTS"
  | "TAG_NOT_FOUND"
  | "SENSOR_NOT_FOUND"
  | "HOUSEHOLD_SENSOR_ALREADY_EXISTS"
  | "HOUSEHOLD_INVITATION_ALREADY_EXISTS"
  | "HOUSEHOLD_INVITATION_INVALID"
  | "HOUSEHOLD_USER_ALREADY_EXISTS"
  | "ADMIN_HOUSEHOLD_USER_CANNOT_LEAVE";

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
