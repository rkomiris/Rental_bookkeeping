
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsAdminViewComponent } from './widgets-admin-view.component';

const routes: Routes = [{
  path:'',
  component:WidgetsAdminViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsAdminViewRoutingModule { }
