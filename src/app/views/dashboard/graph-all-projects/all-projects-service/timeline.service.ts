import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { TaskProjectService } from './../../../onclick/task-project.service';
import { ProjectService } from './../../../onclick/project.service';
import { DrawingService } from './drawing.service';
import { Injector } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { GraphAllProjectsComponent } from '../graph-all-projects.component';
// graph service. this draws an entire graph on a container div.
export class TimelineGraph {
  private _size: number;
  private _weekTick: number;
  private _goffset = 120;
  private _svg;
  private _graph;
private _progressText;
  private _container;
  private drawing: DrawingService;
  private _tooltip;
  private _progress;
  private _onClickEvent = null;
  private _projects;
  private _milestones;
  private _milestoneProjects;





  constructor(container, projects, milestones) {
      this._container = container;
      this._projects=projects;
      this._milestones=milestones;
  }
  calculateWeeksBetween(date1: Date, date2: Date) {
    return Math.floor( Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }
  drawTimeline() {
    const self = this;

    this._size = Math.max(this._container.offsetWidth, this._container.offsetHeight);
    this._weekTick = this._size / (12 * 4);

    d3.select(this._container)
        .select('svg')
        .remove();

    this._svg = d3.select(this._container)
        .append('svg')
        .attr('id', 'graphviewersvg')
        .attr('width', this._container.offsetWidth)
        .attr('height', this._container.offsetHeight);

    this._tooltip = d3.select(this._container)
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
        .style('opacity', 0.5);
   this._progress = d3.select(this._container)
       .append('div')
        .attr('class', 'progress')
        .style('display', 'none')
        .style('opacity', 0.5);

    this._graph = this._svg.append('g');

    this.drawing = new DrawingService(this._graph);

    this.drawAxis();
    this.drawProjects();
    window.addEventListener("resize", this.drawTimeline);

}

drawAxis() {
    // draw weeks axis
    for (let i = 0; i < 12 * 4; i++) {
        let weekRect = this.drawing.drawRectangle(40, 800, 'white', 1)
            .attr('x', i * this._weekTick + this._goffset)
            .attr('y', 0)
            .style('opacity', 0.25);

        weekRect.on('mouseover', (event) => {
          if (i === this.weekOfYear()){
            weekRect.style('fill',  'green');

          } else if (i !== 2){
            weekRect.style('fill',  'skyblue');
          } else if (i === 2){
            weekRect.style('fill',  'red');

          }
     });

        weekRect.on('mouseout', (event) => {
          if(i != this.weekOfYear()) {
            weekRect.style('fill', 'white');
          }
        });
        this.drawing.drawRectangle( 400,20,'grey', 1)
        .attr('x', i * this._weekTick + this._goffset)
        .attr('y', 800)
        .style('opacity', 0.25);
        let text = this.drawing.drawText(i, i * this._weekTick + this._goffset, 830, 10)
            .style('stroke', 'darkgrey')
            .style('text-anchor', 'middle');

        if (i === 2) {
            text.style('stroke', 'red');
        }
        if(i === this.weekOfYear()){
          weekRect.style('fill', 'green').attr('width',10).style('stroke','dotted');
        }
    }
    this.drawing.drawLine(-240, -50, this._size + this._goffset, -50, 1)
    this.drawing.drawLine(-240, 0, this._size + this._goffset, 0, 1)
    this.drawing.drawLine(this._goffset, 0, this._goffset, 800).style('opacity', 0.2);
    this.drawing.drawLine(0, 0, 0, 800).style('opacity', 0.2);
    this.drawing.drawLine(-120, 0, -120, 800).style('opacity', 0.2);

    this.drawing.drawLine(-240, 0, -240, 800).style('opacity', 0.2);


}
 weekOfYear() {
  let now: any;
  let onejan:  any;
  now = new Date();
   onejan = new Date(now.getFullYear(), 0, 1);
  let week = Math.ceil( (((now - onejan) / 86400000) + onejan.getDay() + 1) / 7 );
  return week;
}
drawProjects() {
    let i = 0;
    this._projects.forEach(project => {
        this.drawProject(i++, project);
    });
}
 getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
   selectColor(){
    var r = Math.floor(Math.random()*256);          // Random between 0-255
    var g = Math.floor(Math.random()*256);          // Random between 0-255
    var b = Math.floor(Math.random()*256);          // Random between 0-255
    var rgb = 'rgb(' + r + ',' + g + ',' + b + ')'; // Collect all to a string
return rgb;
}

getRGBValues(str, scale) {
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match ? {
      red: match[1],
      green: match[2]+scale,
      blue: match[3]+scale
    } : {};
  }
  rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}
drawProject(row, project: Project) {
    var selectedColor1=this.selectColor();
    var selectedColor2=this.selectColor();
    this.drawing.drawText(project.name, 20, row * 50 + 25, 15);
    this.drawing.drawLine(-240, row * 50, this._size + this._goffset, row * 50, 1)
        .style('opacity', 0.25);
    project.milestoneProjects.forEach((milestone,i) => {
        let length = Math.abs(milestone.endWeek - milestone.startWeek );
        
       var rgbcolor1= this.getRGBValues(selectedColor1,(i+1)+20);
       var rgbcolor2= this.getRGBValues(selectedColor2,(i+1)+20);

       var color1=this.rgb2hex(rgbcolor1.red,rgbcolor1.green,rgbcolor1.blue);
       var color2=this.rgb2hex(rgbcolor2.red,rgbcolor2.green,rgbcolor2.blue);
       var scaledColor=d3.scaleLinear()
       .domain([0,6])
       .range([color1,color2]);
        let milestoneRect = this.drawing.drawRectangle( length * this._weekTick, 45  , scaledColor(i+1%6) , 'white', 1);

        milestoneRect.attr('rx', 10)
            .attr('ry', 10)
            .attr('x', milestone.startWeek * this._weekTick + this._goffset)
            .attr('y', row * 50 + 2)
            .style('opacity', 0.6)
            .classed('project-milestone');
            
            milestoneRect.on('mouseover', (event) => {
            this.showTooltip(row, project, milestone);
            this.showProgressBar(row, project, milestone,i);
            milestoneRect.style('opacity', 1);
        });

        milestoneRect.on('mouseout', (event) => {
            this.hideTooltip();
            this._progress.html('');
            this._progress.style('display','none');

          this.hideProgress();
          milestoneRect.style('opacity', 0.5);

        });

        milestoneRect.on('click', (event) => {
            if (this._onClickEvent){
                this._onClickEvent(project);
            }
        });

        let cx: number = (length / 2 + milestone.startWeek) * this._weekTick + this._goffset;
        this.drawing.drawText(this._milestones[i].name, cx, row * 50 + 25, 10)
         .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
         

    });
}
 

 


setOnclickEvent(callback) {
    this._onClickEvent = callback;
}



hideTooltip() {
    this._tooltip.style('display', 'none');
}
hideProgress() {
this._progress.remove();
 this._progressText.remove();
}
showProgressBar(row, project, milestone,i){
    
    let length = Math.abs(milestone.endWeek - milestone.startWeek );
  this._progress = this.drawing.drawRectangle(length * this._weekTick - 20, 20, 'white', 'white', 1);
  this._progress.attr('rx', 10)
      .attr('ry', 10)
      .attr('x', milestone.startWeek * this._weekTick + this._goffset)
      .attr('y', row * 50 + 25)
      .style('opacity', 0.6)
      .style('pointer-events','none')
      .classed('project-milestone');

      let cx: number = (length / 2 + milestone.startWeek) * this._weekTick + this._goffset;
      this._progressText=this.drawing.drawText(this._milestones[i].percentage, cx, row * 50 + 40, 10)
          .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
          
        }

showTooltip(row, project, milestone) {
    this._tooltip.style('display', 'block').style('opacity', 0.95);
    this._tooltip.html('');
    let list = this._tooltip.append('pre')
        .style('background-color', 'white')
        .style('padding', '0px')
        .style('margin', '0px')
        .append('ul')
        .attr('class', 'list-group')
        .style('margin', '0px');

    list.append('li').html('Name&#9;&#9 <a href="#">' + project.name + '</a>')
        .attr('class', 'list-group-item')
        .style('padding', '4px');
        let length = Math.abs(milestone.endWeek - milestone.startWeek );

    let cx: number = (length / 2 + milestone.startWeek) * this._weekTick + this._goffset;
if (row === 0){
  this._tooltip.style('left', + cx + 'px').style('top', 20 + 'px');

} else{
    this._tooltip.style('left', + cx + 'px').style('top', (row * 50 - 30) + 'px');
}
}
}

