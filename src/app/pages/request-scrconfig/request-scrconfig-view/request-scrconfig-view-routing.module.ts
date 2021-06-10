
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestScrconfigViewComponent } from './request-scrconfig-view.component';
const routes: Routes = [{
  path: 'request-scrconfig-view',
  component: RequestScrconfigViewComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestScrconfigViewRoutingModule { }
