import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,
  HttpParams,
  HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' ,
                             /* 'Access-Control-Allow-Origin' : '*' */
                            })
};

@Injectable({
  providedIn: 'root'
})

export class PortfolioService {
  private portfoliostUrl = 'http://localhost:8080/ProjectOnKlick/rest/portfolio';
  constructor(private http: HttpClient) { }

  getPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>( this.portfoliostUrl );
  }
}