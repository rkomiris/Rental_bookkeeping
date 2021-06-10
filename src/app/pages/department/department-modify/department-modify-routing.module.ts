import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentModifyComponent } from './department-modify.component';

const routes: Routes = [{
  path: '',
  component: DepartmentModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentModifyRoutingModule { }
