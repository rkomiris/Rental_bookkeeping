
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsAdminAddComponent } from './widgets-admin-add.component';

const routes: Routes = [{
  path:'',
  component:WidgetsAdminAddComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsAdminAddRoutingModule { }
