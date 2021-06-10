import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestViewComponent } from './request-view.component';

const routes: Routes = [
  {
    path: '',
    component: RequestViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestViewRoutingModule { }

