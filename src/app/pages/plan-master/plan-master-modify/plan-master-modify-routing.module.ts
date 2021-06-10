import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanMasterModifyComponent } from './plan-master-modify.component';

const routes: Routes = [{
  path: '',
  component: PlanMasterModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanMasterModifyRoutingModule { }
