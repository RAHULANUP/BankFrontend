import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransferService, TransactionDto } from '../../services/transfer-service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-transfer',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css']
})
export class Transfer implements OnInit {
  customerId: string | null = null;
  accountNo: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transferService: TransferService
  ) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.accountNo = this.route.snapshot.queryParamMap.get('accountNo');
    console.log('Transfer page loaded for customer:', this.customerId);
    console.log('From account:', this.accountNo);

    // Pre-populate the from account if available
    if (this.accountNo) {
      this.transferForm.patchValue({
        fromAccountNumber: this.accountNo
      });
    }
  }

  private formBuilder = inject(FormBuilder);
  transferForm = this.formBuilder.group({
    fromAccountNumber: ['', [Validators.required]],
    toAccountNumber: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]]
  })

  onSubmit() {
    console.log('Transfer form submitted:', this.transferForm.value);

    if (this.transferForm.valid && this.customerId) {
      const fromAccountNumber = this.transferForm.get('fromAccountNumber')?.value;
      const toAccountNumber = this.transferForm.get('toAccountNumber')?.value;
      const amount = this.transferForm.get('amount')?.value;

      if (!fromAccountNumber || !toAccountNumber || !amount) {
        console.error('All fields are required');
        return;
      }

      // Validation: Can't transfer to same account
      if (fromAccountNumber === toAccountNumber) {
        alert('Cannot transfer to the same account');
        return;
      }

      const transferData = {
        fromCustomerId: parseInt(this.customerId),
        fromAccountNumber: parseInt(fromAccountNumber),
        toAccountNumber: parseInt(toAccountNumber),
        amount: parseFloat(amount)
      };

      console.log('Transfer data:', transferData);

      this.transferService.transfer(transferData).subscribe(
        (response: TransactionDto) => {
          console.log('Transfer successful:', response);
          
          this.router.navigate(['/dashbd', fromAccountNumber], {
            queryParams: { customerId: this.customerId }
          });
        },
        (error) => {
          console.error('Transfer failed:', error);
          
          let errorMessage = 'Transfer failed. ';
          if (error.error?.message) {
            errorMessage += error.error.message;
          } else if (error.status === 400) {
            errorMessage += 'Please check account numbers and ensure sufficient balance.';
          } else if (error.status === 404) {
            errorMessage += 'One or both account numbers not found.';
          } else {
            errorMessage += 'Please try again later.';
          }
          
          alert(errorMessage);
        }
      );
    } else {
      console.log('Form is invalid or customer ID is missing');
    }
  }
}
