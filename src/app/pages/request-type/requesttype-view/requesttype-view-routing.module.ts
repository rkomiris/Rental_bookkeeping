
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequesttypeViewComponent } from './requesttype-view.component';

const routes: Routes = [{
  path:'',
  component:RequesttypeViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequesttypeViewRoutingModule { }
