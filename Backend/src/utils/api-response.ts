export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(
  data?: T,
  message?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
  };
}

export function errorResponse(
  message: string,
  errors?: unknown
): ApiErrorResponse {
  return {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  };
}
