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

export class TaskProjectService {
  private projectUrl = 'http://localhost:8080/ProjectOnKlick/rest/taskProject';
  constructor(private http: HttpClient) { }

  getTaskProjects(): Observable<TaskProject[]> {
    return this.http.get<TaskProject[]>( this.projectUrl );
  }

  addTaskProject (taskProject: TaskProject): Observable<TaskProject> {
    return this.http.put<TaskProject>(this.projectUrl + '/add', taskProject, httpOptions);
  }
}
