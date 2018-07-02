import { Component, OnInit } from '@angular/core';
import { ProjectService } from './../project.service';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit {
  projects: Project[];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(p => {
      this.projects = null;
      this.projects = p;
    });
  }

}
