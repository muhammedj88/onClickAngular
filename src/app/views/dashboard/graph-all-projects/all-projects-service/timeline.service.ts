import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities';
import { TaskProjectService } from './../../../onclick/task-project.service';
import { ProjectService } from './../../../onclick/project.service';
import { DrawingService } from './drawing.service';
import { Injector } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { GraphAllProjectsComponent } from '../graph-all-projects.component';
import { start } from 'repl';
import * as hslToHex from 'hsl-to-hex';
import * as hexToHsl from 'hex-to-hsl';
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
    private _onClickSort = null;
    private _label;
    private _projects: Project[];
    private _milestones;
    private _milestoneProjects;
    private _timeLineHeight;
    private _lastDate;
    private _firstDate;
    private _projectByClient: Project[];
    private numOfWeeks;
    private startDate = new Date();
    private endDate = new Date();
    private startProjectWeek;

    constructor(container) {
        this._container = container;
    }
    calculateWeeksBetween(date1, date2) {
        return Math.floor(Math.abs(new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 60 * 60 * 24 * 7));
    }
    drawTimeline(projects, milestones) {
        this._projects = projects;
        this._milestones = milestones;
        this._projects.forEach(project => {
            if (new Date(project.endDate).getTime() > new Date(this.endDate).getTime()) {
                this.endDate = new Date(project.endDate);
            }
            this._lastDate = this.endDate.toLocaleDateString('en-GB');
            if (new Date(project.startDate).getTime() < new Date(this.startDate).getTime()) {
                this.startDate = new Date(project.startDate);
            }
            this._firstDate = this.startDate.toLocaleDateString('en-GB');
        });
        this.numOfWeeks = this.calculateWeeksBetween(this.startDate, this.endDate);
        this._size = Math.max(this._container.offsetWidth, this._container.offsetHeight);
        this._weekTick = (this._size / this.numOfWeeks) + 1;



        this._timeLineHeight = projects.length * 50 + 80;

        d3.select(this._container).style('height', this._timeLineHeight)
            .select('svg')
            .remove();

        this._svg = d3.select(this._container)
            .append('svg')
            .attr('id', 'graphviewersvg')
            .attr('width', this._container.offsetWidth)
            .attr('height', this._timeLineHeight)

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
        //window.addEventListener("resize", this.drawTimeline());

    }


    drawAxis() {

        // draw weeks axis
        for (let i = 0; i <= this.numOfWeeks; i++) {
            let weekRect = this.drawing.drawRectangle(40, this._timeLineHeight + 10, 'white', 1)
                .attr('x', i * this._weekTick + this._goffset)
                .attr('y', 0)
                .style('opacity', 0.25);

            weekRect.on('mouseover', (event) => {
                if (i === this.getWeek(new Date())) {
                    weekRect.style('fill', 'green');

                } else if (i !== 2) {
                    weekRect.style('fill', 'skyblue');
                } else if (i === 2) {
                    weekRect.style('fill', 'red');

                }
            });

            weekRect.on('mouseout', (event) => {
                if (i != this.getWeek(new Date())) {
                    weekRect.style('fill', 'white');
                }
            });
            this.drawing.drawRectangle(50, 20, 'grey', 1)
                .attr('x', i * this._weekTick + this._goffset)
                .attr('y', this._timeLineHeight + 10)
                .style('opacity', 0.25);
            let text = this.drawing.drawText(i, i * this._weekTick + this._goffset, this._timeLineHeight + 45, 10)
                .style('stroke', 'darkgrey')
                .style('text-anchor', 'middle');

            if (i === 2) {
                text.style('stroke', 'red');
            }
            if (i === this.getWeek(new Date())) {
                weekRect.style('fill', 'green').attr('width', 10).style('stroke', 'dotted');
            }
        }

        let headers = ['Name', 'Client', '  Portfol', 'End', 'Start'];
        this.drawing.drawLine(-480, -50, this._size + this._goffset, -50, 1);
        this.drawing.drawLine(-480, 0, this._size + this._goffset, 0, 1);

        this.drawing.drawLine(this._goffset, -50, this._goffset, this._timeLineHeight).style('opacity', 0.2);
        for (let i = 0; i < 5; i++) {
            this.drawing.drawLine(-120 * i, -50, -120 * i, this._timeLineHeight).style('opacity', 0.2);
            this.drawing.drawText(headers[i], (i) * (-this._goffset) + 40, -20, 20)
                .attr('font-weight', 'bold').style('text-anchor', 'middle').style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
            this.drawing.drawTextWithIcon('\uf0dc', (i) * (-this._goffset) + 80, -15, 30)
                .on('click', (event) => {
                    if (this._onClickSort) {
                        this._onClickSort(headers[i]);
                    }
                });

        }


    }
    getWeek(date) {
        let onejan: any;
        let now: any;
        now = new Date(date);
        onejan = new Date(now.getFullYear(), 0, 1);
        let week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        return week;
    }


    drawProjects() {
        let i = 0;
        this._projects.forEach(project => {
            this.drawProject(i++, project);
        });
        this.drawing.drawLine(-480, this._timeLineHeight, this._size + this._goffset, this._timeLineHeight, 1)
            .style('opacity', 0.25);
        var startYear = (new Date()).getFullYear();
        this.drawing.drawText(this._firstDate, 80, -60, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
        this.drawing.drawText(this._lastDate, this._container.offsetWidth + 25, -60, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
    }


    getRandomColor(i) {
        var colorsArr = ['#e664bc', '#d6c0c0', '#8e52b8', '#90c8da', '#f4f377', '#ef3e36', '#80abe0', '#ffb6b9', '#8bbf89', '#f6a1c6', '#96bdd5', '#c9c2ff', '#8895e1', '#c9c2ff', '#ffb6b9', '#1fa091', '#fff9cd', '#5eb5c0', '#ef8d9e', '#d97f7f', '#6e9d8d'];
        if (i > colorsArr.length - 1) {
            i = Math.floor(Math.random() * colorsArr.length);
        }
        return colorsArr[i];
    }


    changeHslColor(color) {
        var h = color[0];
        var s = color[1];
        var l = color[2];
        var colorArrar = [h, s, l];
        return colorArrar;
    }

    ColorFunc(color, i) {

        var hslColor = this.changeHslColor(hexToHsl(color));
        var hue = hslColor[0];
        var saturation = hslColor[1] + i * 5;
        var luminosity = hslColor[2] - 5 * (i + 1);
        var hex = hslToHex(hue, saturation, luminosity);
        return hex;
    }
    drawProject(row, project: Project) {
        this.startProjectWeek = this.getStartWeekOfProject(project);
        this.drawing.drawText(project.name, 20, row * 50 + 25, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
        this.drawing.drawText(project.client.name, -110, row * 50 + 25, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
        this.drawing.drawText(project.client.portfolio.name, -220, row * 50 + 25, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
        this.drawing.drawText(project.endDate.split('T')[0], -340, row * 50 + 25, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');
        this.drawing.drawText(project.startDate.split('T')[0], -450, row * 50 + 25, 15).style('stroke', '#a8b4b4').style('fill', '#a8b4b4');

        var randomColor = this.getRandomColor(row);
        this.drawing.drawLine(-480, row * 50, this._size + this._goffset, row * 50, 1).style('opacity', 0.25);
        project.milestoneProjects.forEach((milestone, i) => {
            let length = Math.abs((milestone.endWeek) - (milestone.startWeek));
            let milestoneRect = this.drawing.drawRectangle(length * this._weekTick, 40, this.ColorFunc(randomColor, i), 'white', 1);
            milestoneRect.attr('rx', 10)
                .attr('ry', 10)
                .attr('x', (milestone.startWeek + this.startProjectWeek) * this._weekTick + this._goffset)
                .attr('y', row * 50 + 2)
                .style('opacity', 0.6)
                .classed('project-milestone');

            milestoneRect.on('mouseover', (event) => {
                this.showTooltip(i + 1, row, project, milestone);
                this.showProgressBar(row, project, milestone, i);
                milestoneRect.style('opacity', 1);
            });

            milestoneRect.on('mouseout', (event) => {
                this.hideTooltip();
                this._progress.html('');
                this._progress.style('display', 'none');

                this.hideProgress();
                milestoneRect.style('opacity', 0.5);

            });

            milestoneRect.on('click', (event) => {
                if (this._onClickEvent) {
                    this._onClickEvent(project);
                }
            });

            let cx: number = (length / 2 + milestone.startWeek + this.startProjectWeek) * this._weekTick + this._goffset;
            this.drawing.drawText(this._milestones[i].name, cx, row * 50 + 25, 12)
                .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');


        });
    }





    setOnclickEvent(callback) {
        this._onClickEvent = callback;

    }

    setSortEvent(callback) {
        this._onClickSort = callback;
    }

    hideTooltip() {
        this._tooltip.style('display', 'none');
    }
    hideProgress() {
        this._progress.remove();
        this._progressText.remove();
    }
    showProgressBar(row, project, milestone, i) {
        this.startProjectWeek = this.getStartWeekOfProject(project);

        let length = Math.abs(milestone.endWeek - milestone.startWeek);
        this._progress = this.drawing.drawRectangle(length * this._weekTick - 20, 20, 'white', 'white', 1);
        this._progress.attr('rx', 10)
            .attr('ry', 8)
            .attr('x', (milestone.startWeek + this.startProjectWeek) * this._weekTick + this._goffset)
            .attr('y', row * 50 + 20)
            .style('opacity', 0.6)
            .style('pointer-events', 'none')
            .classed('project-milestone');

        let cx: number = (length / 2 + milestone.startWeek + this.startProjectWeek) * this._weekTick + this._goffset;
        this._progressText = this.drawing.drawText(this.getMileStoneDone(i, project.projectId)['DonePercentage'] + '%', cx, row * 50 + 40, 15)
            .style('text-anchor', 'middle').style('stroke', 'red').style('fill', 'white');

    }

    showTooltip(i, row, project, milestone) {
        this._tooltip.style('display', 'block').style('opacity', 0.95);
        this._tooltip.html('');
        let list = this._tooltip.append('pre')
            .style('background-color', 'white')
            .style('padding', '0px')
            .style('margin', '0px')
            .append('ul')
            .attr('class', 'list-group')
            .style('margin', '0px');


        list.append('li').html('Done Tasks&#9;&#9 <a href="#">' + this.getMileStoneDone(i, project.projectId)['countDone'] + ' / ' + this.getMileStoneDone(i, project.projectId)['countAll'] + '</a>')
            .attr('class', 'list-group-item')
            .style('padding', '4px');
        let length = Math.abs(milestone.endWeek - milestone.startWeek);
        this.startProjectWeek = this.getStartWeekOfProject(project);
        let cx: number = (length / 2 + milestone.startWeek + this.startProjectWeek) * this._weekTick + this._goffset * 2;
        if (cx > 1000) {
            cx = cx - 200;
        }
        if (cx < 400) {
            cx = cx + 200;
        }
        if (row === 0) {
            this._tooltip.style('left', + cx + 'px').style('top', 20 + 'px');

        } else {
            this._tooltip.style('left', + cx - 200 + 'px').style('top', (row * 30 + 50) + 'px');
        }
    }
    getStartWeekOfProject(project) {
        return this.startProjectWeek = this.calculateWeeksBetween(project.startDate, this.startDate) - 1;

    }
    getMileStoneDone(mileId: number, projectId) {
        let countDone: number = 0;
        let countAll: number = 1;
        let DonePercentage;
        let projectMile: Project = this._projects.filter(p => p.projectId == projectId)[0];
        if (projectMile.taskProjects == null) {
            return 0;
        }
        projectMile.taskProjects.forEach(t => {
            if (t.task.milestone.milestoneId == mileId) {
                if (t.status == 2) {
                    countDone++;
                }
                countAll++;
            }

        });
        DonePercentage = ((countDone / countAll) * 100).toFixed(0);
        return {
            countDone,
            countAll,
            DonePercentage
        };

    }

}

