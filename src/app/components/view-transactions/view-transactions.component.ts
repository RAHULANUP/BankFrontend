import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TransactionDto } from '../../model/Transaction';

@Component({
  selector: 'app-view-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-transactions.component.html',
  styleUrl: './view-transactions.component.css'
})
export class ViewTransactions implements OnInit {
  transactions: TransactionDto[] = [];
  accountNumber!: number;
  customerId!: number;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Get customerId from URL params
    this.route.params.subscribe(params => {
      this.customerId = +params['customerId'];
      // Get accountNumber from query params
      this.route.queryParams.subscribe(queryParams => {
        this.accountNumber = +queryParams['accountNumber'];
        if (this.accountNumber) {
          this.loadTransactions();
        } else {
          this.error = 'Account number is required';
        }
      });
    });
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = null;
    
    this.transactionService.getTransactionsByAccountNumber(this.accountNumber)
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
          this.error = 'Failed to load transactions. Please try again.';
          this.loading = false;
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return 'N/A';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString() + ' '
    } catch (error) {
      return 'Invalid Date';
    }
  }

  getTransactionTypeClass(type: string | undefined | null): string {
    if (!type) {
      return 'transaction-neutral';
    }
    switch (type.toLowerCase()) {
      case 'deposit':
        return 'transaction-credit';
      case 'withdrawal':
      case 'withdraw':
        return 'transaction-debit';
      case 'transfer':
        return 'transaction-transfer';
      default:
        return 'transaction-neutral';
    }
  }
}