import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayDetailsViewComponent } from './holiday-details-view.component';
const routes: Routes = [{
  path: 'holiday-details-view',
  component: HolidayDetailsViewComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayDetailsViewRoutingModule { }
