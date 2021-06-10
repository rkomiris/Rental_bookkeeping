import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegationViewComponent } from './delegation-view.component';

const routes: Routes = [
  {
    path:'',
    component: DelegationViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationViewRoutingModule { }
