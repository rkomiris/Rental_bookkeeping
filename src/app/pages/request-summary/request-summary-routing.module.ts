import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSummaryComponent } from './request-summary.component';

const routes: Routes = [{
  path: '',
  component: RequestSummaryComponent
},
{ 
  path: "",
  loadChildren: "./completed-request-approvals/completed-request-approvals.module#CompletedRequestApprovalsModule"
},];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSummaryRoutingModule { }
