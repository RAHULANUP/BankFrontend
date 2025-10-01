import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private baseUrl = "http://localhost:8080/api/customer/";

  constructor(private http: HttpClient) {}

  createAccount(accountData: { customerId: string, initialBalance: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}${accountData.customerId}/createAccount`, {
      initialBalance: accountData.initialBalance
    });
  }
}
