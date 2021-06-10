import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanMasterAddComponent } from './plan-master-add.component';

const routes: Routes = [{
  path: '',
  component: PlanMasterAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanMasterAddRoutingModule { }
