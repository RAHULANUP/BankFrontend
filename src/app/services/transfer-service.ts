import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TransactionDto {
  id?: number;
  fromAccountNumber: number;
  toAccountNumber: number;
  amount: number;
  transactionDate?: string;
  transactionType?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private baseUrl = "http://localhost:8080/api/account/";

  constructor(private http: HttpClient) {}

  transfer(transferData: {
    fromCustomerId: number,
    fromAccountNumber: number,
    toAccountNumber: number,
    amount: number
  }): Observable<TransactionDto> {
    const params = {
      fromAccountNumber: transferData.fromAccountNumber.toString(),
      toAccountNumber: transferData.toAccountNumber.toString(),
      amount: transferData.amount.toString()
    };

    return this.http.post<TransactionDto>(`${this.baseUrl}transfer`, {}, { params });
  }
}
