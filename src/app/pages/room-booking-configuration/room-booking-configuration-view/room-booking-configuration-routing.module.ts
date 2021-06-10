import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomBookingConfigurationViewComponent } from './room-booking-configuration-view.component';

const routes: Routes = [{
  path: '',
  component: RoomBookingConfigurationViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomBookingConfigurationRoutingModule { }
