
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomBookingComponent } from './room-booking.component';

const routes: Routes = [{
  path: '',
  component: RoomBookingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomBookingRoutingModule { }
