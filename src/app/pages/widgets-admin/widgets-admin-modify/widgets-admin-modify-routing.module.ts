
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsAdminModifyComponent } from './widgets-admin-modify.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetsAdminModifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsAdminModifyRoutingModule {}
