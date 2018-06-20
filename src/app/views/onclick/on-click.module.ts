import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectComponent } from './project/project.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';

import { OnClickRoutingModule } from './on-click-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OnClickRoutingModule
  ],
  declarations: [
    CreateProjectComponent,
    ProjectComponent,
    AllProjectsComponent
  ]
})
export class OnClickModule { }
