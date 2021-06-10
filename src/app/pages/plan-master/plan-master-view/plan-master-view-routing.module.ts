import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanMasterViewComponent } from './plan-master-view.component';

const routes: Routes = [{
  path: '',
  component: PlanMasterViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanMasterViewRoutingModule { }
