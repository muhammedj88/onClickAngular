import { TaskProjectService } from './../task-project.service';
import { ProjectService } from './../project.service';
import { MilestoneService } from './../milestone.service';
import { ClientService } from './../client.service';

import { Component, OnInit, AfterViewInit } from '@angular/core';

import { TasksService } from './../tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, AfterViewInit {
  tasks: Tasks[];
  clients: Client[];
  milestones: Milestone[];

  public systems = [
    {name: 'CRM', value: 'CRM', checked: false},
    {name: 'OMS', value: 'OMS', checked: false},
    {name: 'Billing', value: 'Billing', checked: false},
    {name: 'Big Data', value: 'Big Data', checked: false},
    {name: 'Optima', value: 'Optima', checked: false}
  ];


  formTasks:  Array<Tasks>;
  creating: boolean;

  constructor(private taskService: TasksService,
              private clientService: ClientService,
              private projectService: ProjectService,
              private router: Router
            ) { }

  ngOnInit() {
    this.creating = false;
    this.taskService.getTasks().subscribe(t => {
      this.tasks = t;
    });

    this.clientService.getClients().subscribe(c => {
      this.clients = c;
    });
  }

  ngAfterViewInit() {
  }

  getTasks(type: string) {
    this.formTasks = this.tasks.filter(task => task.taskType === type);
  }

  createProject(name, sdate, edate, type, clientid) {
    const stdate = new Date(Number(sdate.split('-')[0]), Number(sdate.split('-')[1]), Number(sdate.split('-')[2]));
    const endate = new Date(Number(edate.split('-')[0]), Number(edate.split('-')[1]), Number(edate.split('-')[2]));

    const project = { 'name' : name,
                      'startDate' : stdate,
                      'endDate' : endate,
                      'type' : type,
                      'client' : this.clients.filter(c => c.clientId === Number(clientid))[0]
                     };

    // alert(this.systems.filter(s => s.checked).length);
    this.creating = true;
    this.projectService.addProject(project as Project)
       .subscribe(p => { this.router.navigate([ '/onclick/project/' + p.projectId]); },
                  err => {
                    alert('Error Exception!');
                    this.router.navigate([ '/500']);
                  });
  }
}