import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="redirect-container">
      <div class="spinner"></div>
      <p>Redirecting...</p>
    </div>
  `,
  styles: [`
    .redirect-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 18px;
      gap: 20px;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class HomeRedirectComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Add a small delay to prevent navigation loops
    setTimeout(() => {
      this.handleRedirect();
    }, 100);
  }

  private handleRedirect(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // User is logged in, redirect to dashboard
      this.accountService.getFirstAccountInfo(currentUser.customerId).subscribe({
        next: (account) => {
          this.router.navigate(['/dashbd', account.accountNumber],{queryParams:{customerId:currentUser.customerId}});
        },
        error: (error) => {
          console.error('Failed to get account info:', error);
          // If we can't get account info, redirect to create account or landing page
          this.router.navigate(['/create-account', currentUser.customerId]);
        }
      });
    } else {
      // User is not logged in, show public landing page
      this.router.navigate(['/landing-page']);
    }
  }
}