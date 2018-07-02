import { ProjectService } from './../project.service';
import { Component, OnInit, AfterViewInit, Input, AfterContentInit } from '@angular/core';
import { MilestoneService } from '../milestone.service';

@Component({
  selector: 'app-project-bar',
  templateUrl: './project-bar.component.html',
  styleUrls: ['./project-bar.component.scss']
})
export class ProjectBarComponent {

  private _projectid: number;

  milestones: Milestone[];
  project: Project;
  weekNumber: number;
  barValues: any[];
  tasks: MyTask[];
  @Input()
  set projectid(projectid: number) {
    this._projectid = projectid;
    const id = this._projectid as number;
    this.projectService.getProject(id).subscribe(p => {
      this.project = p;
      console.log(this.project);
      this.weekNumber =
        this.calculateWeeksBetween(new Date(this.project.startDate), new Date(this.project.endDate));
      this.getTasks();
      this.getBarValues();
   });
   this.milestoneService.getMilestones().subscribe(m => this.milestones = m);
  }

  constructor(private projectService: ProjectService,
              private milestoneService: MilestoneService) { }


  getMilestonesPer() {
    const types = ['success', 'info', 'warning', 'danger'];
    // tslint:disable-next-line:prefer-const
    let i = 0;
    return this.milestones.map(m => { return {
      value: m.percentage ,
      type: types[i++ % 4] ,
      label: m.percentage + ' % - ' + m.name
    };
    });
  }

  getBarValues() {
    const types = ['success', 'info', 'warning', 'danger'];
    let val = 1;
    let typ = 0;
    this.barValues = [];
      for (let i = 1; i <= this.weekNumber ; i++) {
        val = this.tasks.filter(t => ((t.week === i) && (t.color) === 'red')).length;

        if (val < 1 ) {
          typ = 0;
        } else if (val < 2) {
          typ = 2;
        } else {
          typ = 3;
        }
        this.barValues.push({
          value: 1 ,
          type: types[typ] ,
         // label: i
        });
      }
  }
  calculateWeeksBetween(date1: Date, date2: Date) {
    return Math.floor( Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }

  getTasks() {
    this.tasks = [];
    this.project.taskProjects.forEach(t => {
      if (this.tasks.filter(m => (m.stakeholderId === t.stakeholder.stakeholderId)
                          && (m.week === t.week)).length === 0) {
                            this.tasks.push({
          stakeholderId :  t.stakeholder.stakeholderId,
          stakholderName : t.stakeholder.name,
          week : t.week,
          num : 1,
          done: 'task0',
          color : 'green'
        });
      } else {
        this.tasks .filter(m => (m.stakeholderId === t.stakeholder.stakeholderId)
                          && (m.week === t.week))[0].num ++;
      }
    } );

    for ( let i = 0; i < this.tasks.length; i++ ) {
      console.log(this.tasks[i]);
      if (this.tasks[i].num > 5 && this.tasks[i].num <= 10) {
        this.tasks[i].color = 'orange';
      } else if (this.tasks[i].num > 10) {
        this.tasks[i].color = 'red';
      } else  {
      }

      console.log(this.getTasks);
    }
  }
  test() {
    alert('1 ' + this._projectid);
  }
}


interface MyTask {
  stakeholderId: number;
  stakholderName: string;
  week: number;
  num: number;
  done: string;
  color: string;
}
