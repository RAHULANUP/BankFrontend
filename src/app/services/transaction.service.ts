import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionDto } from '../model/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transaction';

  constructor(private http: HttpClient) { }

  getTransactionsByAccountNumber(accountNumber: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.baseUrl}/by-account?accountNumber=${accountNumber}`);
  }
}