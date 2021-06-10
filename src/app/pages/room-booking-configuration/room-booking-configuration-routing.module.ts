import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomBookingConfigurationComponent } from './room-booking-configuration.component';

const routes: Routes = [{
  path:'',
  component:RoomBookingConfigurationComponent
},
{ 
  path: "room-booking-configuration-add",
  loadChildren: "./room-booking-configuration-add/room-booking-configuration-add.module#RoomBookingConfigurationAddModule"
},

{ 
  path: "room-booking-configuration-modify",
  loadChildren: "./room-booking-configuration-modfiy/room-booking-configuration-modfiy.module#RoomBookingConfigurationModfiyModule"
}
,

{ 
  path: "room-booking-configuration-view",
  loadChildren: "./room-booking-configuration-view/room-booking-configuration-view.module#RoomBookingConfigurationViewModule"
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoomBookingConfigurationRoutingModule { }
