import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestModifyComponent } from './request-modify.component';

const routes: Routes = [
  {
    path: '',
    component: RequestModifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestModifyRoutingModule { }

