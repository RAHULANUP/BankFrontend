import { CreateAccountService } from '../../services/create-account-service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccount implements OnInit {
  customerId: string | null = null;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private createAccount: CreateAccountService
  ) {}
  
  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    console.log('Customer ID from route:', this.customerId);
  }
  
  private formBuilder = inject(FormBuilder);
  accountForm = this.formBuilder.group({
    initialBalance: ['', [Validators.required, Validators.min(0.01)]]
  })
  
  onSubmit() {
    if (this.accountForm.valid && this.customerId) {
      const initialBalance = this.accountForm.get('initialBalance')?.value;
      
      // Type guard to ensure initialBalance is not null/undefined
      if (!initialBalance) {
        console.error('Initial balance is required');
        return;
      }
      
      console.log('Creating account with:');
      console.log('Customer ID:', this.customerId);
      console.log('Initial Balance:', initialBalance);
      
      // Create the account data object
      const accountData = {
        customerId: this.customerId,
        initialBalance: parseFloat(initialBalance)
      };
      
      // Call the service to create the account
      this.createAccount.createAccount(accountData).subscribe(
        (response) => {
          console.log('Account created successfully:', response);
          // Navigate to dashboard with account number and customer ID
          if (response.accountNumber && this.customerId) {
            this.router.navigate(['/dashbd', response.accountNumber], {
              queryParams: { customerId: this.customerId }
            });
          } else {
            console.error('No account number or customer ID available');
          }
        },
        (error) => {
          console.error('Error creating account:', error);
          // Handle error - show user-friendly message
        }
      );
    } else {
      console.log('Form is invalid or customer ID is missing');
    }
  }
}
