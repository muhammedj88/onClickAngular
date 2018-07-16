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
  private _projectByPortfolilo: Project[];
  private _projectByType: Project[];
  constructor(private projectService: ProjectService, private router: Router, private milestonesService: MilestoneService) {
  }

  ngOnInit() {

    this.projectService.getProjects().subscribe(p => {
      this.projects = p;
      this._projectByClient = p;
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
    this.selectedValue=value;
    this.search();
  
  }
 search(){
  if(this.selectedValue=="Client Name"){
    this.searchByClient();
  }else if(this.selectedValue=="Portfolio Name"){
    this.searchByPortfolio(this.cname);

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
    if (this.cname == "") {
      this._projectByClient = this.projects;
      this._clientName = "";

    } else {
      this._projectByClient = this.projects.filter(
        _project => _project.client.name.includes(this.cname)
      );
    }

   this. drawAfterFilter(this._projectByClient);

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
  searchByPortfolio( pname: string)
  {
   
    this._projectByPortfolilo= this.projects ;
     this._projectByPortfolilo =this.projects.filter(   
      projects => projects.client.portfolio.name.includes(pname)
   ); 
     if(pname=="")
     {
      this._projectByPortfolilo=this.projects ;
    
     }
    
     this.projects=this._projectByPortfolilo;
     this. drawAfterFilter(this._projectByPortfolilo);

    
  }
searchByType( )
  {
    if (this.cname == "") {
      this._projectByType = this.projects;

    } else {
      console.log( this._projectByType);
      this._projectByType = this.projects.filter(
        _project => _project.type.includes(this.cname)
      );
    }

   this. drawAfterFilter(this._projectByType);

  }
  
  //filterOpenProjects(): Number {
   
    //   let openProjects = 0 ;
    //   let _date = new Date();
    //   let tasks;
     
    // // console.log(_date);
    // this.projectService.getProjects().subscribe(p => {
    //   this.projects = null;
    //   this.projects = p;
    //   this.projects.forEach(p => {
    //     tasks = p.taskProjects;
    //     let newDate = new Date(p.endDate);
  
    //     if(newDate.getTime() < _date.getTime()){
    //       openProjects++;
    //     }
    //     else{
  
    //       tasks.forEach(t=>{
  
    //         if(!tasks.status){
    //           openProjects++;
             
    //         }
           
    //       });
               
              
    //           }
  
        
    //   });
    // });
     
    //   return openProjects;
    
    //  }
    //  filterClosedProjects():Number{
    //     let open :any = this.filterOpenProjects();
    //     let closeProjects :any;
    //     let len :any = this.projects.length;
    //     closeProjects = len - open;
   
    //   return closeProjects;
    //  }
  

}
