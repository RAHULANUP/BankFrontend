import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositService } from '../../services/deposit-service';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-deposit-amount',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './deposit-amount.html',
  styleUrl: './deposit-amount.css'
})
export class DepositAmount implements OnInit {
  customerId:string|null=null;
  accountNumber:string|null=null;

  constructor(private route:ActivatedRoute,private router:Router,private depositService:DepositService){}

  ngOnInit(){
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    // Get account number from query parameters if available
    this.accountNumber = this.route.snapshot.queryParamMap.get('accountNo');
    console.log('Deposit page - Customer ID:', this.customerId);
    console.log('Deposit page - Account Number:', this.accountNumber);
  }

  
  private formBuilder = inject(FormBuilder);
  depositForm = this.formBuilder.group({
    accountNumber: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]]
  })

  onSubmit(){
    console.log("Deposit amount",this.depositForm.value);

    if(this.depositForm.valid && this.customerId){
      const accountNumber = this.depositForm.get('accountNumber')?.value;
      const amount = this.depositForm.get('amount')?.value;

      if(!amount || !accountNumber){
        console.error("Amount and account number are required");
        return;
      }
      const depositData={
        customerId:parseInt(this.customerId),
        accountNumber:parseInt(accountNumber),
        amount:parseFloat(amount)
      }
      console.log("Deposit data:",depositData)
      this.depositService.deposit(depositData).subscribe(
        (response)=>{
          console.log(response)
          this.router.navigate(['/dashbd',accountNumber],{queryParams:{customerId:this.customerId}})
        },
        (error)=>{
          console.log("Deposit Fail",error)
        }
      )
    }else{
      console.log("Form is invalid or customer Id is missing")
    }
  }
}
