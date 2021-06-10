import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestResolverModifyComponent } from './request-resolver-modify.component';

const routes: Routes = [
  {
    path: 'request-resolver-modify',
    component: RequestResolverModifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestResolverModifyRoutingModule { }
