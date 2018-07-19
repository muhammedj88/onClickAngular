import { TimelineGraph } from './all-projects-service/timeline.service';
import { DrawingService } from './all-projects-service/drawing.service';
import { TaskProjectService } from './../../onclick/task-project.service';
import { ProjectService } from './../../onclick/project.service';
import { ViewChild, Component, AfterViewInit, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { MilestoneService } from './../../onclick/milestone.service';
import { Router } from '@angular/router';
import * as svgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-graph-all-projects',
  templateUrl: './graph-all-projects.component.html',
  styleUrls: ['./graph-all-projects.component.scss'],
})
export class GraphAllProjectsComponent implements AfterViewInit, OnInit {
  @ViewChild('graphviewer') graphContainer: ElementRef;
  public projects: Project[];
  public milestones: Milestone[];
  public cname: string;
  private timeline: TimelineGraph;
  private _projectByClient: Project[];
  private _clientName: string;
  private options: any[];
  private panzoom;
  private selectedProject;
  private selectedTask;
  private selectedValue;
  private sortedArray: any[];
  private searchLength;
  private _projectByPortfolilo: Project[];
  private _projectByType: Project[];
  private closedProjects=0;
  private openProjects=0;
  private openProjectPercentage=0;
  private remainingDays;
  private daysPercentag;
  private projectsDone ;
  constructor(private projectService: ProjectService, private router: Router, private milestonesService: MilestoneService) {
  }

  ngOnInit() {
    console.log('first');
    var startYear=(new Date()).getFullYear();
    var endYear=startYear+1;
    this.remainingDays=Math.ceil((new Date('01/01/'+endYear).getTime()-new Date().getTime())/(1000*60*60*24));
    this.daysPercentag=(this.remainingDays/365) * 100;
    this.projectService.getProjects().subscribe(p => {
      this.projects = p;
      this._projectByClient = p;
      this.projectsDone=this.getALLProjectPerDone().toFixed(2);

      this.milestonesService.getMilestones().subscribe(m => {
      this.milestones = m;
        this.timeline = new TimelineGraph(this.graphContainer.nativeElement);
        this.timeline.drawTimeline(this._projectByClient,this.milestones);
       
        this.timeline.setSortEvent((sortBy) => {
          this.sortedArray=this.sortObj(p,sortBy);
      this.drawAfterFilter(this.sortedArray);
      
    });

        this.timeline.setOnclickEvent((project) => {
          this.selectedProject = project;
        this.router.navigate(['/onclick/project/' + project.projectId]);
        });
        
this.filterOpenProjects();
        this.panzoom = svgPanZoom('#graphviewersvg', {
          maxZoom: 1,
          minZoom: 1,
          zoomScaleSensitivity: 0.25,
          dblClickZoomEnabled: false,
          beforePan: (oldp, newp) => {
            return { x: true, y: false };
          }
        });

      });
    });


  }
  ngAfterViewInit(){
  
    this.selectedValue="Client Name";
  }
  callType(value){
    this.cname="";
    console.log('changed ');
    this. drawAfterFilter(this._projectByClient);
    this.selectedValue=value;
    this.search();

  
  }
 search(){
  if(this.selectedValue=="Client Name"){
    this.searchByClient();
  }else if(this.selectedValue=="Portfolio Name"){
    this.searchByPortfolio();

  }else if(this.selectedValue=="Project Type"){
    this.searchByType();
  }

 }
  sortObj(list, key) {
  function compare(a, b) {
    if(key=="Client"){
      a = a["client"]["name"];
       b = b["client"]["name"];
      }
else if(key=="Start"){
      a = a["startDate"];
      b = b["startDate"];
}else if(key=="End"){
  a = a["endDate"];
      b = b["endDate"];
}else if(key=="Name"){
  a = a["name"];
  b = b["name"];
}else if(key=="Portfol"){
  a = a["portfolio"];
  b = b["portfolio"];
}
    
      var type = (typeof(a) === 'string' ||
                  typeof(b) === 'string') ? 'string' : 'number';
      var result;
      if (type === 'string') result = a.localeCompare(b);
      else result = a - b;
      return result;
  }

  return list.sort(compare);
}
 
  searchByClient() {
    if (this.cname == "" || this.cname==undefined) {
      this._projectByClient = this.projects;
      this._clientName = "";

    } else {
      this._projectByClient = this.projects.filter(
        _project => _project.client.name.includes(this.cname)
      );
    }
    if(this._projectByClient.length>=1){
this.searchLength=this._projectByClient.length;
   this. drawAfterFilter(this._projectByClient);
    }else {
     this.searchLength=0;
      this. drawAfterFilter(this.projects);

    }

  }
  drawAfterFilter(arr){
    console.log('inside the draw func',arr);
    this.timeline.drawTimeline(arr,this.milestones);

    this.panzoom = svgPanZoom('#graphviewersvg', {
      maxZoom: 1,
      minZoom: 1,
      zoomScaleSensitivity: 0.25,
      dblClickZoomEnabled: false,
      beforePan: (oldp, newp) => {
        return { x: true, y: false };
      }
    });
  }
  searchByPortfolio()
  {
   
    if (this.cname == ""|| this.cname==undefined) {
      this._projectByPortfolilo = this.projects;

    } else {
      this._projectByPortfolilo = this.projects.filter(
        _project =>_project.type.toLowerCase().indexOf(this.cname)==0      ); /// change it to filter by portfolio
    }
    if(this._projectByPortfolilo.length>=1){
      this.searchLength=this._projectByPortfolilo.length;

      this. drawAfterFilter(this._projectByPortfolilo);
       }else {
        this.searchLength=0;
         this. drawAfterFilter(this.projects);
   
       }    
  }
searchByType( )
  {
    if (this.cname == ""|| this.cname==undefined) {
      this._projectByType = this.projects;

    } else {
      this._projectByType = this.projects.filter(
        _project =>_project.type.toLowerCase().indexOf(this.cname)==0
      );
    }
    if(this._projectByType.length>=1){
      this.searchLength=this._projectByType.length;

      this. drawAfterFilter(this._projectByType);
       }else {
        this.searchLength=0;

         this. drawAfterFilter(this.projects);
   
       }
  }
  
  filterOpenProjects() {
   
       let taskStatus=0;
       let _date = new Date();
       let tasks;
     
       this.projects.forEach(p => {
         tasks = p.taskProjects;
         let newDate = new Date(p.endDate);
        
          tasks.forEach(t=>{
             if(t.status==2){
               taskStatus++;
             
             }
           
          });
               
               if(taskStatus==tasks.length && newDate.getTime() <= _date.getTime()){
                 this.closedProjects++;
               }else{
                 this.openProjects++;
               }
  
        
       });
       this.openProjectPercentage=this.openProjects/this.projects.length*100;
     
      }
    /* getProjectPerDone(id:number){
  let countDone:number=0;
  let countAll:number = 0;
  let projectPer:Project = this.projects.filter(p=>p.projectId==id)[0];
  projectPer.taskProjects.forEach(t=>{
    if(t.status==2){
      countDone++;
    }
    countAll++;
  });
  console.log(countAll);
  console.log("done tasks :"+countDone);
  console.log("per : %"+((countDone/countAll)*100));
}*/

getALLProjectPerDone(){
  let countDone:number=0;
  let countAll:number = 0;
 this.projects.forEach(p=>{
   p.taskProjects.forEach(t=>{
     if(t.status==2){
       countDone++;
     }
     countAll++;
   })
 })
  console.log(countAll);
  console.log("done tasks :"+countDone);
  console.log("per : %"+((countDone/countAll)*100));
  return (countDone/countAll)*100;
}

  

}
