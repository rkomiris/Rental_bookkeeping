import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeekendMasterAddComponent } from './weekend-master-add.component';

const routes: Routes = [{
  path: '',
  component: WeekendMasterAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekendMasterAddRoutingModule { }
