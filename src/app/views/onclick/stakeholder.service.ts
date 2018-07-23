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

export class StakeholderService {
  private stakeholdertUrl = 'http://localhost:8080/ProjectOnClick/rest/stakeholder';
  constructor(private http: HttpClient) { }

  getStakeholders(): Observable<Stakeholder[]> {
    return this.http.get<Stakeholder[]>( this.stakeholdertUrl );
  }
}