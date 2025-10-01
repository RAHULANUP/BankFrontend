import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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
          // User is logged in, allow access
          return true;
        } else {
          // User is not logged in, redirect to login with return URL
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }
      })
    );
  }
}