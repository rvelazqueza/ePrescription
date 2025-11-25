import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse, 
  UserInfo, 
  LogoutRequest,
  ApiError 
} from '../interfaces/auth.interfaces';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  fullName: string;
  idType: "Cédula" | "DIMEX" | "Pasaporte";
  idNumber: string;
  phone?: string;
  status: "pending" | "approved" | "rejected" | "active" | "blocked";
  mfaEnabled: boolean;
  mfaMethods: Array<"webauthn" | "totp" | "sms" | "email">;
  preferredAuthMethod: "password" | "digital_signature";
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  lastLogin?: string;
  digitalSignatureLinked: boolean;
}

export interface Session {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  createdAt: string;
  lastActivity: string;
  trusted: boolean;
  expiresAt: string;
}

export interface RegistrationRequest {
  id: string;
  fullName: string;
  idType: "Cédula" | "DIMEX" | "Pasaporte";
  idNumber: string;
  email: string;
  phone?: string;
  preferredAuthMethod: "password" | "digital_signature";
  emailVerified: boolean;
  phoneVerified: boolean;
  status: "pending" | "approved" | "rejected";
  riskScore: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshTokenTimer?: any;
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.initializeFromStorage();
  }

  /**
   * Initialize user session from localStorage
   */
  private initializeFromStorage(): void {
    const savedUser = localStorage.getItem('currentUser');
    const token = this.getToken();
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id && user.email) {
          this.currentUserSubject.next(user);
          this.scheduleTokenRefresh();
        } else {
          this.clearSession();
        }
      } catch (error) {
        this.clearSession();
      }
    }
  }

  /**
   * Login with username and password (backend integration)
   */
  login(username: string, password: string): Observable<{ success: boolean; requiresMFA?: boolean; userId?: string; error?: string }> {
    const loginRequest: LoginRequest = { username, password };
    
    return this.http.post<any>(`${this.apiUrl}/api/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          console.log('🔐 Login successful:', response);
          this.handleLoginSuccess(response);
        }),
        map(response => ({
          success: true,
          requiresMFA: false,
          userId: response.userInfo?.id || this.extractUserIdFromToken(response.accessToken)
        })),
        catchError(error => {
          const errorMessage = this.extractErrorMessage(error);
          console.error('❌ Login failed:', errorMessage);
          return throwError(() => ({
            success: false,
            error: errorMessage
          }));
        })
      );
  }

  /**
   * Handle successful login response from backend
   */
  private handleLoginSuccess(response: any): void {
    // Store tokens
    this.setToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);
    
    // Map backend UserInfo to frontend User
    const user = this.mapUserInfoToUser(response.userInfo);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Schedule token refresh
    this.scheduleTokenRefresh(response.expiresIn);
  }

  /**
   * Map UserInfo from backend to User interface
   */
  private mapUserInfoToUser(userInfo: any): User {
    // If userInfo is null, extract from token
    if (!userInfo) {
      const token = this.getToken();
      if (token) {
        const decoded = this.decodeToken(token);
        return {
          id: decoded.sub || 'unknown',
          email: decoded.email || 'unknown@example.com',
          fullName: decoded.name || decoded.preferred_username || 'Unknown User',
          idType: "Cédula",
          idNumber: decoded.preferred_username || 'unknown',
          status: "active",
          mfaEnabled: false,
          mfaMethods: [],
          preferredAuthMethod: "password",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          digitalSignatureLinked: false
        };
      }
    }
    
    return {
      id: userInfo.id || userInfo.userId || 'unknown',
      email: userInfo.email || 'unknown@example.com',
      fullName: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || userInfo.username || 'Unknown User',
      idType: "Cédula", // Default, should come from backend
      idNumber: userInfo.username || 'unknown', // Temporary mapping
      status: "active",
      mfaEnabled: false,
      mfaMethods: [],
      preferredAuthMethod: "password",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      digitalSignatureLinked: false
    };
  }

  /**
   * Decode JWT token to extract user information
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }

  /**
   * Extract user ID from JWT token
   */
  private extractUserIdFromToken(token: string): string {
    try {
      const decoded = this.decodeToken(token);
      return decoded.sub || decoded.user_id || 'unknown';
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return 'unknown';
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => ({ status: 401, message: 'No refresh token available' }));
    }

    const refreshRequest: RefreshTokenRequest = { refresh_token: refreshToken };
    
    return this.http.post<any>(`${this.apiUrl}/api/auth/refresh`, refreshRequest)
      .pipe(
        tap(response => {
          console.log('🔄 Token refreshed successfully');
          this.setToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);
          this.scheduleTokenRefresh(response.expiresIn);
        }),
        map(response => response.accessToken),
        catchError(error => {
          console.error('❌ Token refresh failed:', error);
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(expiresIn?: number): void {
    // Clear existing timer
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }

    // Default to 50 minutes if no expiration provided (tokens usually expire in 1 hour)
    const refreshTime = (expiresIn || 3600) * 1000 * 0.8; // Refresh at 80% of expiration time
    
    this.refreshTokenTimer = setTimeout(() => {
      console.log('⏰ Auto-refreshing token...');
      this.refreshToken().subscribe({
        next: () => console.log('✅ Auto-refresh successful'),
        error: (error) => console.error('❌ Auto-refresh failed:', error)
      });
    }, refreshTime);
  }

  /**
   * @deprecated Legacy method - kept for compatibility with existing components
   * TODO: Implement MFA with backend
   */
  verifyMFA(userId: string, code: string, method: string): Observable<{ success: boolean; error?: string }> {
    console.warn('⚠️ verifyMFA is a legacy method - MFA not yet implemented with backend');
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ 
          success: false, 
          error: "MFA not yet implemented with backend" 
        });
        observer.complete();
      }, 600);
    });
  }

  /**
   * @deprecated Legacy method - kept for compatibility with existing components
   * TODO: Implement digital signature with backend
   */
  validateGaudiSignature(idNumber: string, signatureData: string): Observable<{ 
    success: boolean; 
    userId?: string; 
    error?: string;
    certificateInfo?: any;
  }> {
    console.warn('⚠️ validateGaudiSignature is a legacy method - Digital signature not yet implemented with backend');
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ 
          success: false, 
          error: "Digital signature authentication not yet implemented with backend" 
        });
        observer.complete();
      }, 1500);
    });
  }

  /**
   * @deprecated Legacy method - kept for compatibility with existing components
   * TODO: Implement password recovery with backend
   */
  requestPasswordRecovery(email: string): Observable<{ success: boolean; error?: string }> {
    console.warn('⚠️ requestPasswordRecovery is a legacy method - Password recovery not yet implemented with backend');
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * @deprecated Legacy method - kept for compatibility with existing components
   */
  initiatePasswordRecovery(email: string): Observable<{ success: boolean }> {
    return this.requestPasswordRecovery(email).pipe(
      map(result => ({ success: result.success }))
    );
  }

  /**
   * @deprecated Legacy method - kept for compatibility with existing components
   * TODO: Implement password reset with backend
   */
  resetPassword(token: string, newPassword: string): Observable<{ success: boolean; error?: string }> {
    console.warn('⚠️ resetPassword is a legacy method - Password reset not yet implemented with backend');
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ 
          success: false, 
          error: "Password reset not yet implemented with backend" 
        });
        observer.complete();
      }, 800);
    });
  }

  /**
   * Logout user and clear session (backend integration)
   */
  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    
    // Clear local session first
    this.clearSession();
    
    // If we have a refresh token, notify the server
    if (refreshToken) {
      const logoutRequest: LogoutRequest = { refresh_token: refreshToken };
      return this.http.post<void>(`${this.apiUrl}/api/auth/logout`, logoutRequest)
        .pipe(
          tap(() => console.log('🚪 Logout successful')),
          catchError(error => {
            console.warn('⚠️ Logout request failed, but local session cleared:', error);
            return throwError(() => error);
          })
        );
    }
    
    // Return empty observable if no refresh token
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Clear local session data
   */
  private clearSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    
    // Clear refresh timer
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
      this.refreshTokenTimer = undefined;
    }
  }

  /**
   * Extract error message from HTTP error
   */
  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Error: ${error.error.message}`;
    }
    
    switch (error.status) {
      case 400:
        return 'Invalid credentials provided';
      case 401:
        return 'Invalid username or password';
      case 403:
        return 'Access forbidden';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.error?.message || `Error ${error.status}: ${error.message}`;
    }
  }

  /**
   * Get current user
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user (method version)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && !!this.getToken();
  }

  /**
   * @deprecated Legacy method - users should be fetched from backend
   */
  getUsers(): User[] {
    console.warn('⚠️ getUsers is a legacy method - users should be fetched from backend');
    return [];
  }

  /**
   * Get the current JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get the refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Set the JWT token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Set the refresh token in localStorage
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }
}