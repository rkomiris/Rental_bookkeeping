import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestTypeComponent } from './request-type.component';

const routes: Routes = [{
  path:'',
  component:RequestTypeComponent
},
{
  path: "requesttype-add",
  loadChildren: "./requesttype-add/requesttype-add.module#RequesttypeAddModule"
},
{
  path: "requesttype-modify",
  loadChildren: "./requesttype-modify/requesttype-modify.module#RequesttypeModifyModule"
},
{
  path: "requesttype-view",
  loadChildren: "./requesttype-view/requesttype-view.module#RequesttypeViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RequestTypeRoutingModule { }
