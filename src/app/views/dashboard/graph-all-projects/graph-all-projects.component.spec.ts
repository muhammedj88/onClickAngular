import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphAllProjectsComponent } from './graph-all-projects.component';

describe('GraphAllProjectsComponent', () => {
  let component: GraphAllProjectsComponent;
  let fixture: ComponentFixture<GraphAllProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphAllProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphAllProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
