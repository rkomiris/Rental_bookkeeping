import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';

const routes: Routes = [{
    path: '',
    component: AuthenticationComponent
  },
  {
    path: "",
    loadChildren: './authentication-add/authentication-add.module#AuthenticationAddModule'
  },
  {
    path: "",
    loadChildren: './authentication-modify/authentication-modify.module#AuthenticationModifyModule'
  },
  {
    path: "",
    loadChildren: './authentication-view/authentication-view.module#AuthenticationViewModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthenticationRoutingModule { }
