import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent } from './department.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentComponent
  },
  {
    path: "department-add",
    loadChildren: './department-add/department-add.module#DepartmentAddModule'
  },
  {
    path: "department-modify",
    loadChildren: './department-modify/department-modify.module#DepartmentModifyModule'
  },
  {
    path: "department-view",
    loadChildren: './department-view/department-view.module#DepartmentViewModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }

