import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovallistComponent } from './approvallist.component';
const routes: Routes = [
  {
    path: '',
    component:ApprovallistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovallistRoutingModule { }
