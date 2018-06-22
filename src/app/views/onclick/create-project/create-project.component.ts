import { TaskProjectService } from './../task-project.service';
import { ProjectService } from './../project.service';
import { MilestoneService } from './../milestone.service';
import { ClientService } from './../client.service';

import { Component, OnInit, AfterViewInit } from '@angular/core';

import { TasksService } from './../tasks.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, AfterViewInit {
  tasks: Tasks[];
  clients: Client[];
  milestones: Milestone[];


  formTasks:  Array<Tasks>;

  constructor(private taskService: TasksService,
              private clientService: ClientService,
              private milestoneService: MilestoneService,
              private projectService: ProjectService,
              private taskProjectService: TaskProjectService
            ) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe(t => {
      this.tasks = t;
    });

    this.clientService.getClients().subscribe(c => {
      this.clients = c;
    });

    this.milestoneService.getMilestones().subscribe(m => {
      this.milestones = m;
    });
  }

  ngAfterViewInit() {
  }

  getTasks(type: string) {
    this.formTasks = this.tasks.filter(task => task.taskType === type);
  }
  calculateWeeksBetween(startDate: Date, endDate: Date) {
    return Math.floor( Math.abs(startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }

  getStartMilestones() {
    const startsMilestones: Array<number> =  new Array(this.milestones.length);
    startsMilestones[0] = 0;
    for (let i = 1; i < this.milestones.length ; i++) {
      startsMilestones[i] = this.milestones[i - 1].percentage + startsMilestones[i - 1];
    }
    return startsMilestones;
  }

  createTasks(startDate: Date, endDate: Date) {
    const weekNumber = this.calculateWeeksBetween(startDate, endDate);
    const startsMilestones = this.getStartMilestones();
    console.log(this.formTasks.length);
    console.log('------------------------------------------------');
    /*for (let i = 0; i < this.formTasks.length; i++) {
      console.log(this.formTasks[i].taskId
        + '\t' +
       (
        ((this.formTasks[i].milestone.percentage / 100) * (this.formTasks[i].stagePercentage / 100)) +
        (Number(startDate[this.formTasks[i].milestone.milestoneId - 1]) / 100 )) );
      }*/

      this.formTasks.forEach(t => {
        const tp = {
          'project': {
            'client':  {
              'address': 'a',
              'clientId': 1,
              'name': 'koko'
            } as Client,
            'endDate': '2019-01-12T02:00:00+02:00',
            'name': 'project1',
            'projectId': 1,
            'startDate': '2018-02-02T02:00:00+02:00',
            'type': '1'
        } as Project,
          'stakeholder': t.stakeholder,
          'status': 1,
          'task': t,
          'week': Math.ceil(
            (((t.milestone.percentage / 100) * (t.stagePercentage / 100)) +
            (Number(startsMilestones[t.milestone.milestoneId - 1]) / 100 )) * weekNumber)
        };

        this.taskProjectService.addTaskProject(tp as TaskProject)
          .subscribe(p => {});

        console.log(t.taskId
        + '\t' +
        Math.ceil(
        (((t.milestone.percentage / 100) * (t.stagePercentage / 100)) +
        (Number(startsMilestones[t.milestone.milestoneId - 1]) / 100 )) * weekNumber) );
      });
    console.log('------------------------------------------------');
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

    console.log(project);

    this.projectService.addProject(project as Project)
      .subscribe(p => {});

    this.createTasks(stdate, endate);
  }
}
