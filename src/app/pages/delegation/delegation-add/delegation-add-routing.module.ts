import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegationAddComponent } from './delegation-add.component';

const routes: Routes = [{
  path: '',
  component: DelegationAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationAddRoutingModule { }
