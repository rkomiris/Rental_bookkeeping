import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestWorkflowAddComponent } from './request-workflow-add.component';

const routes: Routes = [{
  path: 'request-configuration-add',
  component: RequestWorkflowAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestWorkflowAddRoutingModule { }
