import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidayDetailsAddComponent } from './holiday-details-add.component';

const routes: Routes = [{
  path: 'holiday-details-add',
  component: HolidayDetailsAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayDetailsAddRoutingModule { }
