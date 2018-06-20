import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectComponent } from './project/project.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'onclick'
    },
    children: [
      {
        path: 'allprojects',
        component: AllProjectsComponent,
        data: {
          title: 'All Projects'
        }
      },
      {
        path: 'createproject',
        component: CreateProjectComponent,
        data: {
          title: 'Create Project'
        }
      },
      {
        path: 'project/:id',
        component: ProjectComponent,
        data: {
          title: 'Project'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnClickRoutingModule {}
