import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestAddComponent } from './request-add.component';

const routes: Routes = [{
  path: '',
  component:RequestAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestAddRoutingModule { }
