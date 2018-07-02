import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectComponent } from './project/project.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';

import { OnClickRoutingModule } from './on-click-routing.module';
import { ProjectBarComponent } from './project-bar/project-bar.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OnClickRoutingModule,
    ProgressbarModule.forRoot(),
    PopoverModule.forRoot()
  ],
  declarations: [
    CreateProjectComponent,
    ProjectComponent,
    AllProjectsComponent,
    ProjectBarComponent
  ]
})
export class OnClickModule { }
