import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomBookingConfigurationModfiyComponent } from './room-booking-configuration-modfiy.component';


const routes: Routes = [{
  path:'', 
  component: RoomBookingConfigurationModfiyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoomBookingConfigurationModfiyRoutingModule { }
