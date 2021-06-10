import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationComponent } from './location.component';

const routes: Routes = [
  {
    path: '',
    component: LocationComponent
  },
  {
    path: "location-add",
    loadChildren: './location-add/location-add.module#LocationAddModule'
  },
  {
    path: "location-modify",
    loadChildren: './location-modify/location-modify.module#LocationModifyModule'
  },
  {
    path: "location-view",
    loadChildren: './location-view/location-view.module#LocationViewModule'
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }


