import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestResolverViewComponent } from './request-resolver-view.component';

const routes: Routes = [
  {
    path: 'request-resolver-view',
    component: RequestResolverViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestResolverViewRoutingModule { }
