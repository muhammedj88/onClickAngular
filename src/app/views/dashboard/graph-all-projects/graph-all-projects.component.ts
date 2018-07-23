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
  private openProjects;
  private openProjectPercentage=0;
  private remainingDays;
  private daysPercentag;
  private projectsDone ;
  private checkBoxValue:boolean = true;

  constructor(private projectService: ProjectService, private router: Router, private milestonesService: MilestoneService) {
  }

  ngOnInit() {
    this.projectService.getProjects().subscribe(p => {
      this.projects = p;
      this._projectByClient = p;
      this.projectsDone=this.getALLProjectPerDone(this.projects).toFixed(2);
      this.remainingDays=this.getremainingDays(this.projects);
      this.openProjects=this.filterOpenProjects(this.projects);
      if(this.checkBoxValue){
     this.projects= this.getProjectOpened(this.checkBoxValue);
      }
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
        
        this.panzoom = svgPanZoom('#graphviewersvg', {
          maxZoom: 1.1,
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
  checkValue(event: any){
    this.checkBoxValue=!this.checkBoxValue;
  }
 

 getProjectOpened(val:boolean){
   let openProjects:Project[];
   openProjects = [];
   
   if(val){
      this.projects.forEach(p=>{
        if(this.filterOpenProject(p)){
          openProjects.push(p);
        }
      });
      return openProjects;
    }
 }
  getremainingDays(searchResult){  
    let endDate=new Date();
    let lastDate;
    searchResult.forEach(project => {
        if(new Date(project.endDate).getTime()> new Date(endDate).getTime()){
            endDate=new Date(project.endDate);
        }
     
    });
    this.remainingDays=Math.ceil((new Date(endDate).getTime()-new Date().getTime())/(1000*60*60*24));
    if(this.remainingDays>0){
    this.daysPercentag=(this.remainingDays/365) * 100;
    }else{
      this.remainingDays=0;
      this.daysPercentag=0;
    }
return this.remainingDays;
  }
  callType(value){
    if(this._projectByClient.length>0){
    this. drawAfterFilter(this._projectByClient);
    this.selectedValue=value;

    }else if(this._projectByPortfolilo.length>0){
      this. drawAfterFilter(this._projectByPortfolilo);
      this.selectedValue=value;


    }else if(this._projectByType.length>0){
      this. drawAfterFilter(this._projectByType);

    }
    

  
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
this.projectsDone=this.getALLProjectPerDone(this._projectByClient).toFixed(2);
this.remainingDays=this.getremainingDays(this._projectByClient);
this.openProjects=this.filterOpenProjects(this._projectByClient);

   this. drawAfterFilter(this._projectByClient);
    }else {
     this.searchLength=0;
      this. drawAfterFilter(this.projects);
      this.projectsDone=this.getALLProjectPerDone(this.projects).toFixed(2);
      this.remainingDays=this.getremainingDays(this.projects);
     this.openProjects=this.filterOpenProjects(this.projects);


    }

  }
  drawAfterFilter(arr){
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
    if (this.cname == "" || this.cname==undefined) {
      this._projectByPortfolilo = this.projects;
      this._clientName = "";

    } else {
      this._projectByPortfolilo = this.projects.filter(
        _project => _project.client.portfolio.name.includes(this.cname)
      );
    }
    if(this._projectByPortfolilo.length>=1){
this.searchLength=this._projectByPortfolilo.length;
this.projectsDone=this.getALLProjectPerDone(this._projectByPortfolilo).toFixed(2);
this.remainingDays=this.getremainingDays(this._projectByPortfolilo);
this.openProjects=this.filterOpenProjects(this._projectByClient);


   this. drawAfterFilter(this._projectByPortfolilo);

    }else {
     this.searchLength=0;
      this. drawAfterFilter(this.projects);
      this.projectsDone=this.getALLProjectPerDone(this.projects).toFixed(2);
     this.remainingDays= this.getremainingDays(this.projects);
      this.openProjects=this.filterOpenProjects(this.projects);



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
    if(this._projectByType.length>=1  ){
      this.searchLength=this._projectByType.length;
      this.projectsDone=this.getALLProjectPerDone(this._projectByType).toFixed(2);
      this.remainingDays=this.getremainingDays(this._projectByType);
     this.openProjects= this.filterOpenProjects(this._projectByType);

      this. drawAfterFilter(this._projectByType);
       }else {
        this.searchLength=0;
        this.projectsDone=this.getALLProjectPerDone(this.projects).toFixed(2);
        this.remainingDays=this.getremainingDays(this.projects);
        this.openProjects=this.filterOpenProjects(this.projects);

         this. drawAfterFilter(this.projects);
   
       }
  }
  filterOpenProject(project){
    let taskStatus=0;
    let _date=new Date();
    let tasks;
    let projectStatus=0;
    let newDate = new Date(project.endDate);

    project.taskProjects.forEach(t=>{
      if(t.status==2){
        taskStatus++;
      }
    });
    if(taskStatus==project.taskProjects.length && newDate.getTime() <=_date.getTime()){
      projectStatus=0;
    }else{
      projectStatus=1;
    }
    return projectStatus;
  }
 filterOpenProjects(searchResults) {
   
       let taskStatus=0;
       let _date = new Date();
       let tasks;
       this.openProjects=0;
    this.closedProjects=0;
       searchResults.forEach(p => {
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
     return this.openProjects;
      }
  

getALLProjectPerDone(searchResults){
  let countDone:number=0;
  let countAll:number = 0;
  if(searchResults.length>=1){
 searchResults.forEach(p=>{
   p.taskProjects.forEach(t=>{
     if(t.status==2){
       countDone++;
     }
     countAll++;
   })
 })
}
  return (countDone/countAll)*100;
}

  

}
