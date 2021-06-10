import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeekendMasterModifyComponent } from './weekend-master-modify.component';

const routes: Routes = [{
  path: '',
  component: WeekendMasterModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekendMasterModifyRoutingModule { }
