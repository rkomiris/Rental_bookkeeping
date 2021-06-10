import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationViewComponent } from './authentication-view.component';

const routes: Routes = [{
  path: 'authentication-view',
  component:AuthenticationViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationViewRoutingModule { }
