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
  // private _projects;

  private _container;
  private drawing: DrawingService;
  private _tooltip;
  private _progress;
  private _onClickEvent = null;

  private projects = [
      {
          name: 'test1',
          tasks: [
              {
                  name: 'Scoping',
                  length: 4,
                  start: 1,
                  color: '#3CB371',
                  percentage: '20%'
              },
              {
                  name: 'Construct',
                  length: 6,
                  start: 5,
                  color: '#2E8B57',
                  percentage: '40%'

              },
              ,
              {
                  name: 'UAT',
                  length: 2,
                  start: 11,
                  color: '#228B22',
                  percentage: '5%'

              },
              ,
              {
                  name: 'Production',
                  length: 3,
                  start: 13,
                  color: '#008000',
                  percentage: '8%'

              },
              ,
              {
                  name: 'BAU',
                  length: 5,
                  start: 16,
                  color: '#006400',
                  percentage: '50%'

              },
          ]
      },
      {
        name: 'first test',
        tasks: [
            {
                name: 'Scoping',
                length: 7,
                start: 15,
                color: '#9370DB'
            },
            {
                name: 'Construct',
                length: 2,
                start: 22,
                color: '#6A5ACD'
            },
            ,
            {
                name: 'UAT',
                length: 5,
                start: 24,
                color: '#8A2BE2'
            },
            ,
            {
                name: 'Production',
                length: 3,
                start: 29,
                color: '#8B008B'
            },
            ,
            {
                name: 'BAU',
                length: 5,
                start: 32,
                color: '#4B0082'
            },
        ]
    },
      {
        name: 'second test',
        tasks: [
            {
                name: 'Scoping',
                length: 4,
                start: 0,
                color: 'green'
            },
            {
                name: 'Construct',
                length: 5,
                start: 4,
                color: 'orange'
            },
            ,
            {
                name: 'UAT',
                length: 2,
                start: 9,
                color: 'blue'
            },
            ,
            {
                name: 'Production',
                length: 3,
                start: 11,
                color: 'red'
            },
            ,
            {
                name: 'BAU',
                length: 5,
                start: 14,
                color: 'purple'
            },
        ]
    },
    ,
      {
        name: 'first test',
        tasks: [
            {
                name: 'Scoping',
                length: 4,
                start: 10,
                color: 'green'
            },
            {
                name: 'Construct',
                length: 5,
                start: 14,
                color: 'orange'
            },
            ,
            {
                name: 'UAT',
                length: 2,
                start: 19,
                color: 'blue'
            },
            ,
            {
                name: 'Production',
                length: 3,
                start: 21,
                color: 'red'
            },
            ,
            {
                name: 'BAU',
                length: 5,
                start: 24,
                color: 'purple'
            },
        ]
    },
  ];

  constructor(container) {
      this._container = container;
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
}

drawAxis() {
    for (let i = 0; i < 12 * 4; i++) {
        let weekRect = this.drawing.drawRectangle(40, 400, 'white', 1)
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

        let text = this.drawing.drawText('W' + i, i * this._weekTick + this._goffset, 410, 10)
            .style('stroke', 'darkgrey')
            .style('text-anchor', 'middle');

        if (i === 2) {
            text.style('stroke', 'red');
        }
        if(i === this.weekOfYear()){
          weekRect.style('fill', 'green');
        }
    }

    this.drawing.drawLine(this._goffset, 0, this._goffset, 400).style('opacity', 0.2);
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
    this.projects.forEach(project => {
        this.drawProject(i++, project);
    });
}

drawProject(row, project) {

    this.drawing.drawText(project.name, 20, row * 50 + 25, 15);
    this.drawing.drawLine(0, row * 50, this._size + this._goffset, row * 50, 1)
        .style('opacity', 0.25);
    project.tasks.forEach(task => {
        let taskRect = this.drawing.drawRectangle(task.length * this._weekTick, 45, task.color, 'white', 1);

        taskRect.attr('rx', 10)
            .attr('ry', 10)
            .attr('x', task.start * this._weekTick + this._goffset)
            .attr('y', row * 50 + 2)
            .style('opacity', 0.6)
            .classed('project-task');

        taskRect.on('mouseover', (event) => {
            this.showTooltip(row, project, task);
           // this.showProgressBar(row, project, task);
            taskRect.style('opacity', 1);
        });

        taskRect.on('mouseout', (event) => {
            this.hideTooltip();
            console.log('insdie the mouseout');
            this._progress.html('');
            this._progress.style('display','none');

          this.hideProgress();
            taskRect.style('opacity', 0.5);

        });

        taskRect.on('click', (event) => {
            if (this._onClickEvent){
              console.log('onClick event');
                this._onClickEvent(project, task);
            }
        });

        let cx: number = (task.length / 2 + task.start) * this._weekTick + this._goffset;
        this.drawing.drawText(task.name, cx, row * 50 + 25, 10)
            .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
           // this.drawing.drawText(project.pecentage, cx, row * 50 + 25, 10)
           // .style('text-anchor', 'left').style('stroke', 'white').style('fill', 'white');

    });
}

 componentToHex(c) {
  let hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

 rgbToHex(color) {
  return '#' + this.componentToHex(color[0]) + this.componentToHex(color[1]) + this.componentToHex(color[2]);
}
// random color for each peoject
setProjectColor() {
  let color = new Array();
  for (let i = 0; i < 3 ; i++) {
  color.push (Math.floor(Math.random() * 255));
  }
return this.rgbToHex(color);
}

setOnclickEvent(callback) {
    this._onClickEvent = callback;
}



hideTooltip() {
    this._tooltip.style('display', 'none');
}
hideProgress() {
  console.log('insdie the hideprogress');
this._progress.remove();
  this._progress.style('display', 'none');

  this._progress.html('');
}
showProgressBar(row, project, task){

  this._progress.style('display', 'block').style('opacity', 0.95);
  this._progress.html('');

  let progressRect = this.drawing.drawRectangle(task.length * this._weekTick - 20, 45, task.color, 'white', 1);

  progressRect.attr('rx', 10)
      .attr('ry', 10)
      .attr('x', task.start * this._weekTick + this._goffset)
      .attr('y', row * 50 + 2)
      .style('opacity', 0.6)
      .classed('project-task');

      let cx: number = (task.length / 2 + task.start) * this._weekTick + this._goffset;
      this.drawing.drawText('25% ', cx, row * 50 + 25, 10)
          .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
          this.drawing.drawText(project.pecentage, cx, row * 50 + 25, 10)
          .style('text-anchor', 'left').style('stroke', 'white').style('fill', 'white');
        }

showTooltip(row, project, task) {
    this._tooltip.style('display', 'block').style('opacity', 0.95);
    this._tooltip.html('');
    let list = this._tooltip.append('pre')
        .style('background-color', 'white')
        .style('padding', '0px')
        .style('margin', '0px')
        .append('ul')
        .attr('class', 'list-group')
        .style('margin', '0px');

    list.append('li').html('Name&#9;&#9 <a href="#">' + task.name + '</a>')
        .attr('class', 'list-group-item')
        .style('padding', '4px');

    let cx: number = (task.length / 2 + task.start) * this._weekTick + this._goffset;
if (row === 0){
  this._tooltip.style('left', + cx + 'px').style('top', 20 + 'px');

} else{
    this._tooltip.style('left', + cx + 'px').style('top', (row * 50 - 20) + 'px');
}
}
}

/*import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
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
  private _projects;

  private _container;
  private drawing: DrawingService;
  private _tooltip;
  private _progress;
  private _onClickEvent = null;

 /* private projects = [
      {
          name: 'test1',
          tasks: [
              {
                  name: 'Scoping',
                  length: 4,
                  start: 1,
                  color: '#3CB371',
                  percentage: '20%'
              },
              {
                  name: 'Construct',
                  length: 6,
                  start: 5,
                  color: '#2E8B57',
                  percentage: '40%'

              },
              ,
              {
                  name: 'UAT',
                  length: 2,
                  start: 11,
                  color: '#228B22',
                  percentage: '5%'

              },
              ,
              {
                  name: 'Production',
                  length: 3,
                  start: 13,
                  color: '#008000',
                  percentage: '8%'

              },
              ,
              {
                  name: 'BAU',
                  length: 5,
                  start: 16,
                  color: '#006400',
                  percentage: '50%'

              },
          ]
      },
      {
        name: 'first test',
        tasks: [
            {
                name: 'Scoping',
                length: 7,
                start: 15,
                color: '#9370DB'
            },
            {
                name: 'Construct',
                length: 2,
                start: 22,
                color: '#6A5ACD'
            },
            ,
            {
                name: 'UAT',
                length: 5,
                start: 24,
                color: '#8A2BE2'
            },
            ,
            {
                name: 'Production',
                length: 3,
                start: 29,
                color: '#8B008B'
            },
            ,
            {
                name: 'BAU',
                length: 5,
                start: 32,
                color: '#4B0082'
            },
        ]
    },
      {
        name: 'second test',
        tasks: [
            {
                name: 'Scoping',
                length: 4,
                start: 0,
                color: 'green'
            },
            {
                name: 'Construct',
                length: 5,
                start: 4,
                color: 'orange'
            },
            ,
            {
                name: 'UAT',
                length: 2,
                start: 9,
                color: 'blue'
            },
            ,
            {
                name: 'Production',
                length: 3,
                start: 11,
                color: 'red'
            },
            ,
            {
                name: 'BAU',
                length: 5,
                start: 14,
                color: 'purple'
            },
        ]
    },
    ,
      {
        name: 'first test',
        tasks: [
            {
                name: 'Scoping',
                length: 4,
                start: 10,
                color: 'green'
            },
            {
                name: 'Construct',
                length: 5,
                start: 14,
                color: 'orange'
            },
            ,
            {
                name: 'UAT',
                length: 2,
                start: 19,
                color: 'blue'
            },
            ,
            {
                name: 'Production',
                length: 3,
                start: 21,
                color: 'red'
            },
            ,
            {
                name: 'BAU',
                length: 5,
                start: 24,
                color: 'purple'
            },
        ]
    },
  ];

  constructor(container, projects) {
      this._container = container;
      this._projects = projects;
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
}

drawAxis() {
    for (let i = 0; i < 12 * 4; i++) {
        let weekRect = this.drawing.drawRectangle(40, 400, 'white', 1)
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

        let text = this.drawing.drawText('W' + i, i * this._weekTick + this._goffset, 410, 10)
            .style('stroke', 'darkgrey')
            .style('text-anchor', 'middle');

        if (i === 2) {
            text.style('stroke', 'red');
        }
        if(i === this.weekOfYear()){
          weekRect.style('fill', 'green');
        }
    }

    this.drawing.drawLine(this._goffset, 0, this._goffset, 400).style('opacity', 0.2);
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

drawProject(row, project: Project) {

    this.drawing.drawText(project.name, 20, row * 50 + 25, 15);
    this.drawing.drawLine(0, row * 50, this._size + this._goffset, row * 50, 1)
        .style('opacity', 0.25);
    project.milestoneProjects.forEach(milestone => {
        let length = milestone.endWeek - milestone.startWeek ;
        let taskRect = this.drawing.drawRectangle( length * this._weekTick, 45, 'green' , 'white', 1);

        taskRect.attr('rx', 10)
            .attr('ry', 10)
            .attr('x', milestone.startWeek * this._weekTick + this._goffset)
            .attr('y', row * 50 + 2)
            .style('opacity', 0.6)
            .classed('project-task');

        taskRect.on('mouseover', (event) => {
            this.showTooltip(row, project, milestone);
           // this.showProgressBar(row, project, task);
            taskRect.style('opacity', 1);
        });

        taskRect.on('mouseout', (event) => {
            this.hideTooltip();
            console.log('insdie the mouseout');
            this._progress.html('');
            this._progress.style('display','none');

          this.hideProgress();
            taskRect.style('opacity', 0.5);

        });

        taskRect.on('click', (event) => {
            if (this._onClickEvent){
              console.log('onClick event');
                this._onClickEvent(project, milestone);
            }
        });

        let cx: number = (length / 2 + milestone.startWeek) * this._weekTick + this._goffset;
        this.drawing.drawText(milestone.milestone.name, cx, row * 50 + 25, 10)
            .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
           // this.drawing.drawText(project.pecentage, cx, row * 50 + 25, 10)
           // .style('text-anchor', 'left').style('stroke', 'white').style('fill', 'white');

    });
}

 componentToHex(c) {
  let hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

 rgbToHex(color) {
  return '#' + this.componentToHex(color[0]) + this.componentToHex(color[1]) + this.componentToHex(color[2]);
}
// random color for each peoject
setProjectColor() {
  let color = new Array();
  for (let i = 0; i < 3 ; i++) {
  color.push (Math.floor(Math.random() * 255));
  }
return this.rgbToHex(color);
}

setOnclickEvent(callback) {
    this._onClickEvent = callback;
}



hideTooltip() {
    this._tooltip.style('display', 'none');
}
hideProgress() {
  console.log('insdie the hideprogress');
this._progress.remove();
  this._progress.style('display', 'none');

  this._progress.html('');
}
showProgressBar(row, project, task){

  this._progress.style('display', 'block').style('opacity', 0.95);
  this._progress.html('');

  let progressRect = this.drawing.drawRectangle(task.length * this._weekTick - 20, 45, task.color, 'white', 1);

  progressRect.attr('rx', 10)
      .attr('ry', 10)
      .attr('x', task.start * this._weekTick + this._goffset)
      .attr('y', row * 50 + 2)
      .style('opacity', 0.6)
      .classed('project-task');

      let cx: number = (task.length / 2 + task.start) * this._weekTick + this._goffset;
      this.drawing.drawText('25% ', cx, row * 50 + 25, 10)
          .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
          this.drawing.drawText(project.pecentage, cx, row * 50 + 25, 10)
          .style('text-anchor', 'left').style('stroke', 'white').style('fill', 'white');
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

    list.append('li').html('Name&#9;&#9 <a href="#">' + milestone.milestone.name + '</a>')
        .attr('class', 'list-group-item')
        .style('padding', '4px');

        let length = milestone.endWeek - milestone.startWeek ;
    let cx: number = (length / 2 + milestone.startWeek) * this._weekTick + this._goffset;
if (row === 0){
  this._tooltip.style('left', + cx + 'px').style('top', 20 + 'px');

} else{
    this._tooltip.style('left', + cx + 'px').style('top', (row * 50 - 20) + 'px');
}
}
}*/
