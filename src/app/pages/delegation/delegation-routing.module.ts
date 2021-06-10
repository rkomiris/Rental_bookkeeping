import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegationComponent } from './delegation.component';

const routes: Routes = [{
  path: '',
  component: DelegationComponent
  },
  {
    path: "delegation-add",
    loadChildren: "./delegation-add/delegation-add.module#DelegationAddModule"
  },
  {
    path: "delegation-modify",
    loadChildren: "./delegation-modify/delegation-modify.module#DelegationModifyModule"
  },
  {
    path: "delegation-view",
    loadChildren: "./delegation-view/delegation-view.module#DelegationViewModule"
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationRoutingModule { }
