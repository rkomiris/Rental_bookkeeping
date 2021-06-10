
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsAdminComponent } from './widgets-admin.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetsAdminComponent
  },
  {
    path: 'widgets-admin-add',
    loadChildren: './widgets-admin-add/widgets-admin-add.module#WidgetsAdminAddModule'
  },
  {
    path: 'widgets-admin-modify',
    loadChildren: './widgets-admin-modify/widgets-admin-modify.module#WidgetsAdminModifyModule'
  },
  {
    path: 'widgets-admin-view',
    loadChildren: './widgets-admin-view/widgets-admin-view.module#WidgetsAdminViewModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsAdminRoutingModule {}
