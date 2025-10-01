import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from '../model/UserData';

@Injectable({
  providedIn: 'root'
})
export class Signup {
  private regUrl = "http://localhost:8080/api/customer"

  constructor(private http:HttpClient){}

  signup(userData:UserData):Observable<UserData>{
    return this.http.post<UserData>(this.regUrl,userData);
  }
}
