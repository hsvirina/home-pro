import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const requestUrl = req.url;
  const requestMethod = req.method;

  const publicEndpoints = [
    '/api/cafes',
    '/api/auth/register',
    '/api/auth/login',
  ];

  const isPublic =
    publicEndpoints.some(url => requestUrl.includes(url)) ||
    (requestUrl.includes('/api/reviews') && requestMethod === 'GET');

  if (token && !isPublic) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned);
  } else {
    return next(req);
  }
};
