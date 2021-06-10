import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSubtypeViewComponent } from './request-subtype-view.component';

const routes: Routes = [{
  path: '',
  component:RequestSubtypeViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSubtypeViewRoutingModule { }
