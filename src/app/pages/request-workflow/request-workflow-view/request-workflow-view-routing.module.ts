import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestWorkflowViewComponent } from './request-workflow-view.component';

const routes: Routes = [{
  path: 'request-configuration-view',
  component: RequestWorkflowViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestWorkflowViewRoutingModule { }
