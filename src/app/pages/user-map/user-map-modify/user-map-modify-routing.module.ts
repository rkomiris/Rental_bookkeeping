
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMapModifyComponent } from './user-map-modify.component';
const routes: Routes = [
  {
    path: '',
    component: UserMapModifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMapModifyRoutingModule { }
