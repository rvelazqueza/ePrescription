import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

/**
 * HTTP Interceptor that automatically refreshes tokens on 401 errors
 * This interceptor works in conjunction with the auth interceptor
 */
export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors for non-auth endpoints
      if (error.status === 401 && !req.url.includes('/auth/')) {
        console.log('🔄 401 detected, attempting token refresh...');
        
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            console.log('✅ Token refreshed, retrying request...');
            
            // Clone the original request with the new token
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            
            // Retry the original request with new token
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            console.error('❌ Token refresh failed, redirecting to login');
            // If refresh fails, the AuthService will handle logout
            return throwError(() => refreshError);
          })
        );
      }

      // For non-401 errors or auth endpoints, just pass through
      return throwError(() => error);
    })
  );
};
