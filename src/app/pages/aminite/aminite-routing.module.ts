import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AminiteComponent } from './aminite.component';

const routes: Routes = [{
  path: '',
  component:AminiteComponent
},
{
  path: "",
  loadChildren: "./aminite-add/aminite-add.module#AminiteAddModule"
},
{
  path: "",
  loadChildren: "./aminite-modify/aminite-modify.module#AminiteModifyModule"
},
{
  path: "",
  loadChildren: "./aminite-view/aminite-view.module#AminiteViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AminiteRoutingModule { }
