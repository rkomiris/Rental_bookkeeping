import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayDetailsModifyComponent } from './holiday-details-modify.component';

const routes: Routes = [{
  path: 'holiday-details-modify',
  component: HolidayDetailsModifyComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayDetailsModifyRoutingModule { }
