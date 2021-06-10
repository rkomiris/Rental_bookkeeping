import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeekendMasterViewComponent } from './weekend-master-view.component';

const routes: Routes = [{
  path: '',
  component: WeekendMasterViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekendMasterViewRoutingModule { }
