
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRoleComponent } from './user-role.component';

const routes: Routes = [
  {
    path: '',
    component: UserRoleComponent
  },
  {
    path: "userrole-add",
    loadChildren: './user-role-add/user-role-add.module#UserRoleAddModule'
  },
  {
    path: "userrole-modify",
    loadChildren: './user-role-modify/user-role-modify.module#UserRoleModifyModule'
  },
  {
    path: "userrole-view",
    loadChildren: './user-role-view/user-role-view.module#UserRoleViewModule'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleRoutingModule { }
