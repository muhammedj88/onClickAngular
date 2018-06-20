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

export class ClientService {
  private projectUrl = 'http://localhost:8080/ProjectOnKlick/rest/client';
  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>( this.projectUrl );
  }
}
