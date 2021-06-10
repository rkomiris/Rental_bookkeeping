
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestScrconfigAddComponent } from './request-scrconfig-add.component';

const routes: Routes = [{
  path: 'request-scrconfig-add',
  component: RequestScrconfigAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestScrconfigAddRoutingModule { }
