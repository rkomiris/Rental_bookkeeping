import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneBookDetailsComponent } from './phone-book-details.component';
const routes: Routes = [
  {
    path: '',
    component: PhoneBookDetailsComponent
  },
{
    path: 'phone-add',
    loadChildren: './phone-book-details-add/phone-book-details-add.module#PhoneBookDetailsAddModule'
  },
  {
    path: 'phone-view',
    loadChildren: './phone-book-details-view/phone-book-details-view.module#PhoneBookDetailsViewModule'
  },
  {
    path: 'phone-modify',
    loadChildren: './phone-book-details-modify/phone-book-details-modify.module#PhoneBookDetailsModifyModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneBookDetailsRoutingModule { }
