
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';

const routes: Routes = [{
    path: '',
    component: UserComponent
  },
  {
    path: "user-add",
    loadChildren: './user-add/user-add.module#UserAddModule'
  },
  {
    path: "user-modify",
    loadChildren: './user-modify/user-modify.module#UserModifyModule'
  },
  {
    path: "user-view",
    loadChildren: './user-view/user-view.module#UserViewModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule { }
