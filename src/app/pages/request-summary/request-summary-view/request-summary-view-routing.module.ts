import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSummaryViewComponent } from './request-summary-view.component';

const routes: Routes = [{
  path: '',
  component: RequestSummaryViewComponent
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSummaryViewRoutingModule { }
