
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSubtypeAddComponent } from './request-subtype-add.component';

const routes: Routes = [{
  path: '',
  component:RequestSubtypeAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSubtypeAddRoutingModule { }
