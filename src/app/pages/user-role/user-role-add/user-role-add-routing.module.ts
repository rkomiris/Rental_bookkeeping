
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRoleAddComponent } from './user-role-add.component';

const routes: Routes = [{
  path: '',
  component:UserRoleAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleAddRoutingModule { }
