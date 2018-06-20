import { ClientService } from './../client.service';

import { Component, OnInit } from '@angular/core';

import { TasksService } from './../tasks.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  tasks: Tasks[];
  clients: Client[];

  formTasks:  Array<Tasks>;

  constructor(private taskService: TasksService,
              private clientService: ClientService) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe(t => {
      this.tasks = t;
    });

    this.clientService.getClients().subscribe(c => {
      this.clients = c;
    });
  }
  getTasks(type: string) {
    this.formTasks = this.tasks.filter(task => task.taskType === type);
  }
  calculateWeeksBetween(date1, date2) {
    return Math.floor( Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }
  create(startDate: string, endDate: string) {
    console.log (startDate.split('-')[0]);
    const sdate = new Date(Number(startDate.split('-')[0]), Number(startDate.split('-')[1]), Number(startDate.split('-')[2]));
    const edate = new Date(Number(endDate.split('-')[0]), Number(endDate.split('-')[1]), Number(endDate.split('-')[2]));
    const weekNumber = this.calculateWeeksBetween(sdate, edate);

    this.tasks.forEach(task => console.log(task.stagePercentage));
  }
}
