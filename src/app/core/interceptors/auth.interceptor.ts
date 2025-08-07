import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP interceptor to append Authorization header with Bearer token
 * for protected API requests.
 *
 * It excludes public endpoints and GET requests to reviews from adding the token.
 * The token is retrieved from localStorage.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const { url: requestUrl, method: requestMethod } = req;

  /**
   * List of public API endpoints that do NOT require authorization.
   * Any request matching these URLs will bypass token injection.
   */
  const publicEndpoints = [
    '/api/cafes',
    '/api/auth/register',
    '/api/auth/login',
    '/api/users/public/',
  ];

  /**
   * Determines if the request URL is public:
   * - Matches any of the public endpoints
   * - OR is a GET request to '/api/reviews'
   */
  const isPublic =
    publicEndpoints.some((url) => requestUrl.includes(url)) ||
    (requestUrl.includes('/api/reviews') && requestMethod === 'GET');

  // If there is a token and the request is to a protected endpoint,
  // clone the request and add the Authorization header.
  if (token && !isPublic) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // For public requests or when token is missing, continue without modification.
  return next(req);
};
