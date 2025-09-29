import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BalanceService } from '../../services/balance-service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-select',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashbd.html',
  styleUrls: ['./dashbd.css']
})
export class Dashbd implements OnInit {
  accountNo: string | null = null;
  customerId: string | null = null;
  currentBalance: number | null = null;
  isLoadingBalance: boolean = false;
  balanceError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private balanceService: BalanceService
  ) {}

  ngOnInit() {
    this.accountNo = this.route.snapshot.paramMap.get('accountNo');
    this.customerId = this.route.snapshot.queryParamMap.get('customerId');
    
    console.log('Dashboard loaded for account:', this.accountNo);
    console.log('Customer ID:', this.customerId);
    
    // Fetch balance when component loads
    this.fetchBalance();
  }

  fetchBalance() {
    if (this.customerId && this.accountNo) {
      this.isLoadingBalance = true;
      this.balanceError = null;
      
      this.balanceService.getBalance(this.customerId, this.accountNo).subscribe(
        (response) => {
          console.log('Balance response:', response);
          this.currentBalance = response.balance || response; // Handle different response formats
          this.isLoadingBalance = false;
        },
        (error) => {
          console.error('Error fetching balance:', error);
          this.balanceError = 'Unable to fetch balance';
          this.isLoadingBalance = false;
        }
      );
    } else {
      console.error('Missing customer ID or account number for balance fetch');
    }
  }

  refreshBalance() {
    this.fetchBalance();
  }
}
