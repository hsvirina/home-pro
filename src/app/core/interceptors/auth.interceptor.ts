import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP interceptor for attaching Authorization header to protected requests.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const requestUrl = req.url;
  const requestMethod = req.method;

  // Public endpoints that do not require authentication
  const publicEndpoints = [
    '/api/cafes',
    '/api/auth/register',
    '/api/auth/login',
     '/api/users/public/',
  ];

  // Check if the current request is public
  const isPublic =
    publicEndpoints.some((url) => requestUrl.includes(url)) ||
    (requestUrl.includes('/api/reviews') && requestMethod === 'GET');

  // Attach Authorization header if token is present and endpoint is protected
  if (token && !isPublic) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned);
  }

  // Proceed without modifying the request
  return next(req);
};
