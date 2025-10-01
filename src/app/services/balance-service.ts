import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private baseUrl = "http://localhost:8080/api/customer/";

  constructor(private http: HttpClient) {}

  getBalance(customerId: string, accountNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${customerId}/balance?accountNumber=${accountNumber}`);
  }
}