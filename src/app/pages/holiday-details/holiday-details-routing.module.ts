import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayDetailsComponent } from './holiday-details.component';
const routes: Routes = [
  {
    path: '',
    component: HolidayDetailsComponent
  },
  {
    path: "",
    loadChildren: './holiday-details-add/holiday-details-add.module#HolidayDetailsAddModule'
  },
  {
    path: "",
    loadChildren: './holiday-details-view/holiday-details-view.module#HolidayDetailsViewModule'
  },
  {
    path: "",
    loadChildren: './holiday-details-modify/holiday-details-modify.module#HolidayDetailsModifyModule'
  },];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayDetailsRoutingModule { }
