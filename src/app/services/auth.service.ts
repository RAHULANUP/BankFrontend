import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  customerName: string;
  customerAadhar: string;
}

export interface CustomerDto {
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerAadhar: string;
  customerAge: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/customer';
  private currentUserSubject = new BehaviorSubject<CustomerDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(customerName: string, customerAadhar: string): Observable<CustomerDto> {
    const loginRequest: LoginRequest = {
      customerName,
      customerAadhar
    };

    return this.http.post<CustomerDto>(`${this.baseUrl}/login`, loginRequest)
      .pipe(
        tap(user => {
          // Store user in localStorage and update current user
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(customerId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/${customerId}/logout`, {}, { responseType: 'text' })
      .pipe(
        tap(() => {
          // Clear user from localStorage and update current user
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        })
      );
  }

  getCurrentUser(): CustomerDto | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  logoutLocal(): void {
    // Logout without calling API (for local cleanup)
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}