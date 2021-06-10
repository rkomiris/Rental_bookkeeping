
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserMapAddComponent } from './user-map-add.component';
const routes: Routes = [
  {
    path: '',
    component: UserMapAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMapAddRoutingModule { }
