import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestScrconfigComponent } from './request-scrconfig.component';


const routes: Routes = [{
  path: '',
  component: RequestScrconfigComponent
},
{
  path: "",
  loadChildren: "./request-scrconfig-add/request-scrconfig-add.module#RequestScrconfigAddModule"
},
{
  path: "",
  loadChildren: "./request-scrconfig-modify/modify-module.module#ModifyModuleModule"
},
{
  path: "",
  loadChildren: "./request-scrconfig-view/request-scrconfig-view.module#RequestScrconfigViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestScrconfigRoutingModule { }
