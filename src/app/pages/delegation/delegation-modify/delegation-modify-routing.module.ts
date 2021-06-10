import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegationModifyComponent } from './delegation-modify.component';

const routes: Routes = [{
  path: '',
  component: DelegationModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationModifyRoutingModule { }
