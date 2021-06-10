import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeekendMasterComponent } from './weekend-master.component';

const routes: Routes = [{
  path: '',
  component: WeekendMasterComponent
},
{
  path: "weekend-master-add",
  loadChildren: './weekend-master-add/weekend-master-add.module#WeekendMasterAddModule'
},
{
  path: "weekend-master-modify",
  loadChildren: './weekend-master-modify/weekend-master-modify.module#WeekendMasterModifyModule'
},
{
  path: "weekend-master-view",
  loadChildren: './weekend-master-view/weekend-master-view.module#WeekendMasterViewModule'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekendMasterRoutingModule { }
