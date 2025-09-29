import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          // User is already logged in, redirect to their landing page
          this.router.navigate(['/landing-page', user.customerId]);
          return false;
        } else {
          // User is not logged in, allow access to login/register
          return true;
        }
      })
    );
  }
}