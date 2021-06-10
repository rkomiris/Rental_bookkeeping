import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompletedRequestApprovalsComponent } from './completed-request-approvals.component';

const routes: Routes = [{
  path: 'completed-request-approvals',
  component: CompletedRequestApprovalsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompletedRequestApprovalsRoutingModule { }
