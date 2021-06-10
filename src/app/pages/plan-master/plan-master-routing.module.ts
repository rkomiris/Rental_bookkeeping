import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanMasterComponent } from './plan-master.component';

const routes: Routes = [{
  path: '',
  component: PlanMasterComponent
},
{
  path: "plan-master-add",
  loadChildren: './plan-master-add/plan-master-add.module#PlanMasterAddModule'
},
{
  path: "plan-master-modify",
  loadChildren: './plan-master-modify/plan-master-modify.module#PlanMasterModifyModule'
},
{
  path: "plan-master-view",
  loadChildren: './plan-master-view/plan-master-view.module#PlanMasterViewModule'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanMasterRoutingModule { }
