import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSubtypeComponent } from './request-subtype.component';


const routes: Routes = [
  {
    path: '',
    component: RequestSubtypeComponent
  },
  {
    path: "request-subtype-add",
    loadChildren: "./request-subtype-add/request-subtype-add.module#RequestSubtypeAddModule"
  },
  {
    path: "request-subtype-modify",
    loadChildren: "./request-subtype-modify/request-subtype-modify.module#RequestSubtypeModifyModule"
  },
  {
    path: "request-subtype-view",
    loadChildren: "./request-subtype-view/request-subtype-view.module#RequestSubtypeViewModule"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSubtypeRoutingModule { }
