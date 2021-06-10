import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationModifyComponent } from './authentication-modify.component';

const routes: Routes = [{
  path: 'authentication-modify',
  component:AuthenticationModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationModifyRoutingModule { }
