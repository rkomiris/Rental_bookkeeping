import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestResolverComponent } from './request-resolver.component';

const routes: Routes = [{
  path:'',
  component:RequestResolverComponent
},
{ 
  path: "",
  loadChildren: "./request-resolver-modify/request-resolver-modify.module#RequestResolverModifyModule"
},
{ 
  path: "",
  loadChildren: "./request-resolver-view/request-resolver-view.module#RequestResolverViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestResolverRoutingModule { }
