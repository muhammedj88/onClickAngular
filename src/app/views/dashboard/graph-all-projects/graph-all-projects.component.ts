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
  projectByClient: Project [];
  public client:string;

  private timeline: TimelineGraph;

  private panzoom;
  private selectedProject;
  private selectedTask;

  constructor( private projectService: ProjectService, private router: Router, private milestonesService: MilestoneService) {
    }

    ngOnInit() {
      this.projectService.getProjects().subscribe(p => {
        this.projects = p;
        this.projectByClient = p;

        this.milestonesService.getMilestones().subscribe(m=>{ this.milestones=m;
        this.timeline = new TimelineGraph(this.graphContainer.nativeElement, this.projects,this.milestones);
        this.timeline.drawTimeline();
        
    this.timeline.setOnclickEvent((project) => {
      this.selectedProject = project;
        this.router.navigate(['/onclick/project/'+project.projectId]);
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
    
  ngAfterViewInit() {
 


  }
  searchByClient( cname: string)
  {
    this.projects= this.projectByClient; 
     this.projects=this.projects.filter(   
       project => project.client.name.includes(cname)
   ); 
     if(cname=="")
     {
      this.projects= this.projectByClient;
      this.client = "";
     }
    this.client = this.projects[0].client.name;
    }
  
 // projectClick(project: Project) {
 //   this.selectedProject = this.project.taskProjects.filter( t =>
 //   
 //   );
 // }

}
