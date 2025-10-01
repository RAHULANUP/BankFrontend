import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {
  private withdrawUrl = "http://localhost:8080/api/customer/";
  
  constructor(private http:HttpClient){}

  withdraw(accountData:{customerId:number,accountNumber:number,amount:number}):Observable<any>{
    return this.http.post(`${this.withdrawUrl}${accountData.customerId}/withdraw?amount=${accountData.amount}&accountNumber=${accountData.accountNumber}`, {});
  }
}
