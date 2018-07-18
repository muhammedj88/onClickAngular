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
export class TasksService {
  private projectUrl = 'http://localhost:8080/ProjectOnClick/rest/task';
  constructor(private http: HttpClient) { }

  getTasks(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>( this.projectUrl );
  }
}
