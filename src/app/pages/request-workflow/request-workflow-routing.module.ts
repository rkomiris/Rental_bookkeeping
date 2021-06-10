import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestWorkflowComponent } from './request-workflow.component';

const routes: Routes = [{
  path: '',
  component: RequestWorkflowComponent
},
{ 
  path: "",
  loadChildren: "./request-workflow-add/request-workflow-add.module#RequestWorkflowAddModule"
},
{ 
  path: "",
  loadChildren: "./request-workflow-modify/request-workflow-modify.module#RequestWorkflowModifyModule"
},
{ 
  path: "",
  loadChildren: "./request-workflow-view/request-workflow-view.module#RequestWorkflowViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestWorkflowRoutingModule { }
