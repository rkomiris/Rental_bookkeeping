import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentViewComponent } from './department-view.component';

const routes: Routes = [{
  path: '',
  component: DepartmentViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentViewRoutingModule { }
