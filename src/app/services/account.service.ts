import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountDto } from '../model/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:8080/api/account';

  constructor(private http: HttpClient) { }

  getFirstAccountInfo(customerId: number): Observable<AccountDto> {
    return this.http.get<AccountDto>(`${this.baseUrl}/${customerId}`);
  }
}
