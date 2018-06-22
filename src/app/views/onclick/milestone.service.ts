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
export class MilestoneService {
  private milestoneUrl = 'http://localhost:8080/ProjectOnKlick/rest/milestone';
  constructor(private http: HttpClient) { }

  getMilestones(): Observable<Milestone[]> {
    return this.http.get<Milestone[]>( this.milestoneUrl );
  }
}

