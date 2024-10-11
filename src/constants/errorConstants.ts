export const errorConstants = {
  OK: 200,
  CREATED: 201,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,

  // Custom error title
  ERROR_TITLES: {
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    SERVICE_UNAVAILABLE: 'Service Unavailable',
  },

  // Custom error messages
  ERROR_MESSAGES: {
    BAD_REQUEST:
      'Bad request. The server could not understand the request due to invalid syntax.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    FORBIDDEN: 'Access to this resource is forbidden.',
    NOT_FOUND: 'The requested resource was not found.',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred on the server.',
    SERVICE_UNAVAILABLE:
      'The server is currently unavailable. Please try again later.',
  },
};
