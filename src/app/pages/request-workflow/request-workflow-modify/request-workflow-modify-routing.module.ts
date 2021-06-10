import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestWorkflowModifyComponent } from './request-workflow-modify.component';

const routes: Routes = [{
  path: 'request-configuration-modify',
  component: RequestWorkflowModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestWorkflowModifyRoutingModule { }
