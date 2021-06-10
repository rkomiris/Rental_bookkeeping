
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsComponent } from './widgets.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetsComponent
  },
  {
    path: 'widgets-add',
    loadChildren: './widgets-add/widgets-add.module#WidgetsAddModule'
  },
  {
    path: 'widgets-view',
    loadChildren: './widgets-view/widgets-view.module#WidgetsViewModule'
  },
  {
    path: 'widgets-modify',
    loadChildren: './widgets-modify/widgets-modify.module#WidgetsModifyModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsRoutingModule {}
