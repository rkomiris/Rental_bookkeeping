import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneBookDetailsAddComponent } from './phone-book-details-add.component';
const routes: Routes = [
 { path: '',
  component: PhoneBookDetailsAddComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneBookDetailsAddRoutingModule { }
