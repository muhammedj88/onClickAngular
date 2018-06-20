import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, AfterViewInit {

  public id;
  public startDate: Date;
  public endDate: Date;

  public x;
  public t: any[];
  @ViewChild('markers')
  markers: ElementRef;


  d: Date;
  constructor(private route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.getTicks();
  }


  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');

    this.startDate = new Date(2014, 5, 22);
    this.endDate = new Date(2015, 6, 30);
  }

  calculateWeeksBetween(date1, date2) {
    return Math.floor( Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }

  getTicks() {
    const total = this.markers.nativeElement.offsetWidth;
    const weekNumber = this.calculateWeeksBetween(this.startDate, this.endDate);
    this.t = new Array(weekNumber);
    this.d = this.startDate;
    for (let i = 0; i <= weekNumber; i++) {
      this.t[i] = {left : (i * (total / weekNumber)) + 'px' ,
                   date : (this.startDate.getDate() + i * 7)};
    }
  }

}
