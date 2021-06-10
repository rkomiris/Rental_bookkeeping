
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsViewComponent } from './widgets-view.component';

const routes: Routes = [{
  path:'',
  component:WidgetsViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsViewRoutingModule { }
