
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsAddComponent } from './widgets-add.component';

const routes: Routes = [{
  path:'',
  component:WidgetsAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsAddRoutingModule { }
