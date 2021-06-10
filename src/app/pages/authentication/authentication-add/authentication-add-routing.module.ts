import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationAddComponent } from './authentication-add.component';

const routes: Routes = [{
  path: 'authentication-add',
  component:AuthenticationAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationAddRoutingModule { }
