import { TaskProjectService } from './../task-project.service';
import { ProjectService } from './../project.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from '../milestone.service';
import { StakeholderService } from './../stakeholder.service';

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
  public stakeholders: Stakeholder[];

  public hoverTask: MyTask;
  public selectedTasks: SelectedTask[];
  public selectedTasksStakeHolder: MyTask[];
  @ViewChild('markers')
  markers: ElementRef;

  public height;
  public tasckheight = 37;
  public tikheight;
  public summry: any;
  public weekNumber = 0;

  public updating: Boolean;

  public key: String = 'status'; // set default
  public reverse: Boolean = false;
  public weekClicked: Boolean = false;

  d: Date;
  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private taskProjectService: TaskProjectService,
              private milestonesService: MilestoneService,
              private stakeholderService: StakeholderService
            ) { }

  ngAfterViewInit() {
    this.getProject();
  }


  ngOnInit() {
    this.updating = false;
    this.getMilestones();
  }

  getMilestones() {
    return this.milestonesService.getMilestones().subscribe(m => this.milestones = m);
  }

  getStakeholders() {
    return this.stakeholderService.getStakeholders().subscribe(s => this.stakeholders = s);
  }

  getMilestonesPer() {
    const types = ['gray-400', 'gray-500',  'gray-600', 'gray-700', 'gray-800', 'gray-900'];
    // tslint:disable-next-line:prefer-const
    let i = 0;
    if(this.milestones!=undefined){
    return this.milestones.map(m => { return {
      value: m.percentage ,
      type: types[i++ % 6] ,
      label: m.percentage + ' % - ' + m.name
    };
    });
  }
  }

  getProject() {
    const id =   +this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(id)
              .subscribe(p => {
                this.project = null;
                this.project = p;
                this.getTicks();
                this.getTasks(0);
                this.getSummary();
              });
  }

  calculateWeeksBetween(date1: Date, date2: Date) {
    return Math.floor( Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }

  getTicks() {
    const total = this.markers.nativeElement.offsetWidth;
    this.weekNumber =
      this.calculateWeeksBetween(new Date(this.project.startDate), new Date(this.project.endDate));
    this.t = new Array(this.weekNumber);
    this.d = this.project.startDate;
    for (let i = 0; i <= this.weekNumber; i++) {
      this.t[i] = { 'left' : (i * (this.tasckheight + 3)) ,
                    'date' : i + 1 ,
                    'today' : i === this.getCurrentWeek()};
    }
  }

  getTasks(stakeholder: number) {
    this.tasks = [];
    // tslint:disable-next-line:triple-equals
    this.project.taskProjects.filter(t => ((t.stakeholder.stakeholderId == stakeholder) || (stakeholder == 0))).forEach(t => {
      if (this.tasks.filter(m => (m.stakeholderId === t.stakeholder.stakeholderId)
                          && (m.week === t.week)).length === 0) {
                            this.tasks.push({
          stakeholderId :  t.stakeholder.stakeholderId,
          stakholderName : t.stakeholder.name,
          week : t.week,
          num : 1,
          done: 'task0',
          left: this.t[t.week - 1].left + 3,
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
      (t.status === 2) && (t.week === task.week)).length / task.num;
    switch (true) {
      case (val < 0.13) :
      task.done = 'task0'; break;
      case (val < 0.25) :
      task.done = 'task10'; break;
      case (val < 0.38) :
      task.done = 'task15'; break;
      case (val < 0.50) :
      task.done = 'task20'; break;
      case (val < 0.63) :
      task.done = 'task30'; break;
      case (val < 0.75) :
      task.done = 'task40'; break;
      case (val < 0.88) :
      task.done = 'task45'; break;
      case (val < 0.100) :
      task.done = 'task50'; break;
      default:
      task.done = 'taskonehundred';
       }
  }

  taskClick(task: MyTask) {
    this.selectedTasks = this.project.taskProjects.filter( t =>
      (t.stakeholder.stakeholderId === task.stakeholderId) &&
      (t.week === task.week)
    ).map(t => { return {
      id: t.taskProjectId,
      stakeholder: t.stakeholder.name,
      task: t.task.description,
      status : t.status,
      week: t.week
    };
  });
    this.weekClicked = false;
  }

  weekClick(week: number) {
    this.selectedTasks = this.project.taskProjects
    .filter( t => (t.week === week)).map(t => { return {
      id: t.taskProjectId,
      stakeholder: t.stakeholder.name,
      task: t.task.description,
      status : t.status,
      week: t.week
    };
  });
  this.weekClicked = true;
  }

  updateTask(task: SelectedTask) {
    this.updating = true;
    this.taskProjectService.updateTaskProject(task.id).subscribe(t => {
      if (task.status === 1) {
        this.project.taskProjects.find( tsk => tsk.taskProjectId == task.id).status = 2;
      } else {
        this.project.taskProjects.find( tsk => tsk.taskProjectId == task.id).status = 1;
      }
    this.updating = false;
    this.getTasks(0);
    this.getSummary();
    });
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

  scroll(el) {
    el.scrollIntoView();
  }

  stakeholderSelected(stakeholder: number) {
    this.getTasks(stakeholder);
    this.getSummary();
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
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

interface SelectedTask {
  id: number;
  stakeholder: String;
  task: String;
  status: number;
  week: number;
}