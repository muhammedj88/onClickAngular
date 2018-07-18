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

export class ProjectService {
  private projectUrl = 'http://localhost:8080/ProjectOnClick/rest/project';
  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {

    return this.http.get<Project[]>( this.projectUrl );
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>( `${this.projectUrl}/${id}` );
  }

  addProject (project: Project): Observable<Project> {
    return this.http.put<Project>( `${this.projectUrl}/add`, project, httpOptions);
  }
}
