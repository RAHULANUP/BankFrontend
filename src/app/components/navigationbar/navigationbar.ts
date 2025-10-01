import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, CustomerDto } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navigationbar',
  imports: [CommonModule],
  templateUrl: './navigationbar.html',
  styleUrls: ['./navigationbar.css']
})
export class Navigationbar implements OnInit {
  currentUser: CustomerDto | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    if (this.currentUser) {
      this.isLoading = true;
      this.authService.logout(this.currentUser.customerId).subscribe({
        next: (response) => {
          console.log('Logout successful:', response);
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.isLoading = false;
          // Even if API call fails, clear local session
          this.authService.logoutLocal();
          this.router.navigate(['/login']);
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
