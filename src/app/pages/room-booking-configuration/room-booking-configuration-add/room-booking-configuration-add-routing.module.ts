import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomBookingConfigurationAddComponent } from './room-booking-configuration-add.component';


const routes: Routes = [{
  path:'',
  component:RoomBookingConfigurationAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoomBookingConfigurationAddRoutingModule { }
