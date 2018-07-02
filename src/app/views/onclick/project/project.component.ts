import { TaskProjectService } from './../task-project.service';
import { ProjectService } from './../project.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from '../milestone.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, AfterViewInit {

  @Input() project: Project;

  public t: any[];
  public tasks: MyTask[];
  public milestones: Milestone[];

  public hoverTask: MyTask;
  public selectedTasks: TaskProject[];

  @ViewChild('markers')
  markers: ElementRef;

  public height;
  public tasckheight = 26;
  public tikheight;
  public summry: any;

  d: Date;
  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private taskProjectService: TaskProjectService,
              private milestonesService: MilestoneService
            ) { }

  ngAfterViewInit() {
    this.getProject();
  }


  ngOnInit() {
    this.getMilestones();
  }

  getMilestones() {
    return this.milestonesService.getMilestones().subscribe(m => this.milestones = m);
  }

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

  getProject() {
    const id =   +this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(id)
              .subscribe(p => {
                this.project = null;
                this.project = p;
                this.getTicks();
                this.getTasks();
                this.getSummary();
              });
  }

  calculateWeeksBetween(date1: Date, date2: Date) {
    return Math.floor( Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }

  getTicks() {
    const total = this.markers.nativeElement.offsetWidth;
    const weekNumber =
      this.calculateWeeksBetween(new Date(this.project.startDate), new Date(this.project.endDate));
    console.log(weekNumber);
    this.t = new Array(weekNumber);
    this.d = this.project.startDate;
    for (let i = 0; i <= weekNumber; i++) {
      this.t[i] = { 'left' : (i * (total / weekNumber)) ,
                    'date' : i + 1 ,
                    'today' : i === this.getCurrentWeek()};
    }
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
          left: this.t[t.week - 1].left + 2,
          top : 0,
          color : 'green'
        });
      } else {
        this.tasks .filter(m => (m.stakeholderId === t.stakeholder.stakeholderId)
                          && (m.week === t.week))[0].num ++;
      }
    } );

    let c: number;
    for ( let i = 0; i < this.tasks.length; i++ ) {
      console.log(this.tasks[i]);
      if (this.tasks[i].num > 5 && this.tasks[i].num <= 10) {
        this.tasks[i].color = 'orange';
      this.getTaskStyle(this.tasks[i], 'o');
      } else if (this.tasks[i].num > 10) {
        this.tasks[i].color = 'red';
      this.getTaskStyle(this.tasks[i], 'r');
      } else  {
        this.getTaskStyle(this.tasks[i], 'g');
      }


      if ( this.tasks[i].top !== 0 ) {
        continue;
      }

      c = 0;
      for ( let j = i + 1; j < this.tasks.length; j++ ) {
        if ( this.tasks[i].week === this.tasks[j].week ) {
          this.tasks[i].top = c * this.tasckheight;
          c++;
        }
      }
    }

    this.height = Math.max.apply(null, this.tasks.map(h =>  h.top)) + this.tasckheight;
    this.tikheight = this.height + 2;
  }

  getTaskStyle(task: MyTask, color: string) {
    const val = this.project.taskProjects.filter(
      t => (t.stakeholder.stakeholderId === task.stakeholderId) &&
      (t.status === 2)).length / task.num;
      console.log(val);
    switch (true) {
      case (val < 0.13) :
      task.done = color + 'task0'; break;
      case (val < 0.25) :
      task.done =  color + 'task10'; break;
      case (val < 0.38) :
      task.done =  color + 'task15'; break;
      case (val < 0.50) :
      task.done =  color + 'task20'; break;
      case (val < 0.63) :
      task.done =  color + 'task30'; break;
      case (val < 0.75) :
      task.done =  color + 'task40'; break;
      case (val < 0.88) :
      task.done =  color + 'task45'; break;
      case (val < 0.100) :
      task.done =  color + 'task50'; break;
      default:
      task.done =  color + 'taskonehundred';
       }
  }

  taskClick(task: MyTask) {
    this.selectedTasks = this.project.taskProjects.filter( t =>
      (t.stakeholder.stakeholderId === task.stakeholderId) &&
      (t.week === task.week)
    );
  }

  updateTask(task: TaskProject) {
    task.status = 2;
    console.log(task);
    this.taskProjectService.updateTaskProject(task).subscribe(t => {});
  }

  updateTask2(task: TaskProject) {
  }

  getCurrentWeek () {
    return  this.calculateWeeksBetween(new Date(this.project.startDate), new Date());
  }

  getSummary () {
    this.summry = {
      done : this.project.taskProjects
        .filter(t => (t.status === 2) && (t.week <= this.getCurrentWeek())).length /
      this.project.taskProjects
        .filter(t => (t.week <= this.getCurrentWeek())).length
    };
  }
}

interface MyTask {
  stakeholderId: number;
  stakholderName: string;
  week: number;
  num: number;
  done: string;
  left: number;
  top: number;
  color: string;
}
