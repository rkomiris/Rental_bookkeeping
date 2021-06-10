import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalpageComponent } from './approvalpage.component';
const routes: Routes = [ {
  path: '',
  component:ApprovalpageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalpageRoutingModule { }
