
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserMapComponent } from './user-map.component';
const routes: Routes = [
  {
    path: '',
    component: UserMapComponent
  },
{
    path: 'user-map-add',
    loadChildren: './user-map-add/user-map-add.module#UserMapAddModule'
  },
  {
    path: 'user-map-view',
    loadChildren: './user-map-view/user-map-view.module#UserMapViewModule'
  },
  {
    path: 'user-map-modify',
    loadChildren: './user-map-modify/user-map-modify.module#UserMapModifyModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMapRoutingModule { }
