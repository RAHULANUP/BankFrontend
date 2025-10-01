import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private depositUrl = "http://localhost:8080/api/customer/";

  constructor(private http:HttpClient){
    
  }
  deposit(accountData:{customerId:number,accountNumber:number,amount:number}){
    return this.http.post(`${this.depositUrl}${accountData.customerId}/deposit?amount=${accountData.amount}&accountNumber=${accountData.accountNumber}`,{})
  }
}
