import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalViewComponent } from './approvalView.component';


const routes: Routes = [ {
  path: '',
  component:ApprovalViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalViewRoutingModule { }
