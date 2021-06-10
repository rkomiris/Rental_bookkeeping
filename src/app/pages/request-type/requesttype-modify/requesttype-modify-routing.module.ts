import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequesttypeModifyComponent } from './requesttype-modify.component';

const routes: Routes = [{
  path: '',
  component: RequesttypeModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequesttypeModifyRoutingModule { }
