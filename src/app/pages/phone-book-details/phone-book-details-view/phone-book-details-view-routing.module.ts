import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneBookDetailsViewComponent } from './phone-book-details-view.component';
const routes: Routes = [{
  path: '',
  component: PhoneBookDetailsViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneBookDetailsViewRoutingModule { }
