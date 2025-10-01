import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          // User is already logged in, get their account info and redirect to dashboard
          return this.accountService.getFirstAccountInfo(user.customerId).pipe(
            map(account => {
              this.router.navigate(['/dashbd', account.accountNumber],{queryParams:{customerId:user.customerId}});
              return false;
            })
          );
        } else {
          // User is not logged in, allow access to login/register
          return [true];
        }
      })
    );
  }
}