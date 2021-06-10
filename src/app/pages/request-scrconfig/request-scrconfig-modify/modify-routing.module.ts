
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestScrconfigModifyComponent } from './request-scrconfig-modify.component';

const routes: Routes = [{
  path: 'request-scrconfig-modify',
  component: RequestScrconfigModifyComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifyRoutingModule { }
