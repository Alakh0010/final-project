import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export const handleApiError = (error: unknown): ApiError => {
  // Handle Axios errors
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;

    // Handle network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return {
        message: 'Network error. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      };
    }

    // Handle HTTP errors
    if (axiosError.response) {
      const { status, data } = axiosError.response;

      // Common HTTP error statuses
      switch (status) {
        case 400:
          return {
            message: 'Bad request. Please check your input and try again.',
            status,
            details: data,
          };
        case 401:
          return {
            message: 'You are not authorized to perform this action. Please log in and try again.',
            status,
            code: 'UNAUTHORIZED',
          };
        case 403:
          return {
            message: 'You do not have permission to access this resource.',
            status,
            code: 'FORBIDDEN',
          };
        case 404:
          return {
            message: 'The requested resource was not found.',
            status,
            code: 'NOT_FOUND',
          };
        case 500:
          return {
            message: 'An unexpected server error occurred. Please try again later.',
            status,
            code: 'SERVER_ERROR',
          };
        default:
          return {
            message: 'An error occurred while processing your request.',
            status,
            details: data,
          };
      }
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return {
      message: error.message || 'An unknown error occurred',
      details: error,
    };
  }

  // Fallback for unknown errors
  return {
    message: 'An unknown error occurred',
    details: error,
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
};
