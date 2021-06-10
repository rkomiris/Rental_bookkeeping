import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneBookDetailsModifyComponent } from './phone-book-details-modify.component';
const routes: Routes = [{
  path: '',
  component: PhoneBookDetailsModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneBookDetailsModifyRoutingModule { }
