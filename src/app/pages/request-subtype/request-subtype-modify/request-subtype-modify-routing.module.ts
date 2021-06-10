
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSubtypeModifyComponent } from './request-subtype-modify.component';

const routes: Routes = [
  {
  path:'',
  component: RequestSubtypeModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSubtypeModifyRoutingModule { }
