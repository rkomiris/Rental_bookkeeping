
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserMapViewComponent } from './user-map-view.component';
const routes: Routes = [
  {
    path: '',
    component: UserMapViewComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMapViewRoutingModule { }
