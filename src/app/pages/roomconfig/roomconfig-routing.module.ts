import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomconfigComponent } from './roomconfig.component';

const routes: Routes = [{
  path: '',
  component: RoomconfigComponent
},
{ 
  path: "",
  loadChildren: "./roomconfig-add/roomconfig-add.module#RoomconfigAddModule"
},
{ 
  path: "",
  loadChildren: "./roomconfig-modify/roomconfig-modify.module#RoomconfigModifyModule"
},
{ 
  path: "",
  loadChildren: "./roomconfig-view/roomconfig-view.module#RoomconfigViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomconfigRoutingModule { }
