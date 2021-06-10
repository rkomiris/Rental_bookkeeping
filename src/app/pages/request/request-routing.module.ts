
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestComponent } from './request.component';

const routes: Routes = [{
  path:'',
  component:RequestComponent
},
{
  path: "request-add",
  loadChildren: "./request-add/request-add.module#RequestAddModule"
},
{
  path: "request-modify",
  loadChildren: "./request-modify/request-modify.module#RequestModifyModule"
},
{
  path: "request-view",
  loadChildren: "./request-view/request-view.module#RequestViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }



