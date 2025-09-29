import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { AccountDto } from '../../model/Account';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfo implements OnInit {
  accountInfo: AccountDto | null = null;
  customerId!: number;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Get customerId from URL params
    this.route.params.subscribe(params => {
      this.customerId = +params['customerId'];
      if (this.customerId) {
        this.loadAccountInfo();
      } else {
        this.error = 'Customer ID is required';
      }
    });
  }

  loadAccountInfo(): void {
    this.loading = true;
    this.error = null;
    
    this.accountService.getFirstAccountInfo(this.customerId)
      .subscribe({
        next: (data) => {
          this.accountInfo = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching account info:', error);
          this.error = 'Failed to load account information. Please try again.';
          this.loading = false;
        }
      });
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }
}
