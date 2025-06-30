export type ErrorKey =
  | "TAG_ALREADY_EXISTS"
  | "TAG_NOT_FOUND"
  | "SENSOR_NOT_FOUND"
  | "HOUSEHOLD_SENSOR_ALREADY_EXISTS";

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

export class SensorNotFoundError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("SENSOR_NOT_FOUND", 404, metadata, message);
    this.name = "SensorNotFoundError";
  }
}

export class HouseholdSensorAlreadyExistsError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("HOUSEHOLD_SENSOR_ALREADY_EXISTS", 409, metadata, message);
    this.name = "HouseholdSensorAlreadyExistsError";
  }
}
export class TagAlreadyExistsError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("TAG_ALREADY_EXISTS", 409, metadata, message);
    this.name = "TagAlreadyExistsError";
  }
}

export class TagNotFoundError extends AppError {
  constructor(metadata?: Record<string, unknown>, message?: string) {
    super("TAG_NOT_FOUND", 404, metadata, message);
    this.name = "TagNotFoundError";
  }
}
