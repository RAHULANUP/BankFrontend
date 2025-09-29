import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WithdrawService } from '../../services/withdraw-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-withdraw-amount',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './withdraw-amount.html',
  styleUrl: './withdraw-amount.css'
})
export class WithdrawAmount implements OnInit{
  customerId: string | null = null;
  accountNo: string | null = null;
  
  constructor(private route: ActivatedRoute, private router: Router, private withdrawService: WithdrawService){}
  
  ngOnInit(){
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.accountNo = this.route.snapshot.queryParamMap.get('accountNo');
    console.log('Withdraw page - Customer ID:', this.customerId);
    console.log('Withdraw page - Account Number:', this.accountNo);
  }

  private formBuilder = inject(FormBuilder);
  withdrawForm = this.formBuilder.group({
    accountNumber: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]]
  })
  
  onSubmit(){
    console.log("Submitting the form", this.withdrawForm.value);
    
    if(this.withdrawForm.valid && this.customerId){
      const accountNumber = this.withdrawForm.get('accountNumber')?.value;
      const amount = this.withdrawForm.get('amount')?.value;
      
      if (!amount || !accountNumber) {
        console.error("Both account number and amount are required");
        return;
      }

      const withdrawData = {
        customerId: parseInt(this.customerId),
        accountNumber: parseInt(accountNumber),
        amount: parseFloat(amount)
      };

      console.log('Withdraw data:', withdrawData);

      this.withdrawService.withdraw(withdrawData).subscribe(
        (response) => {
          console.log('Withdrawal successful:', response);
          this.router.navigate(['/dashbd', accountNumber], {
            queryParams: { customerId: this.customerId }
          });
        },
        (error) => {
          console.error('Withdrawal failed:', error);
        }
      );
    } else {
      console.log('Form is invalid or customer ID is missing');
    }
  }
}
