import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBarComponent } from './project-bar.component';

describe('ProjectBarComponent', () => {
  let component: ProjectBarComponent;
  let fixture: ComponentFixture<ProjectBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
