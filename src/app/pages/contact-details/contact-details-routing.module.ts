import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailsComponent } from './contact-details.component';

const routes: Routes = [{
  path: '',
  component: ContactDetailsComponent
},
{
  path: "",
  loadChildren: './contact-details-add/contact-details-add.module#ContactDetailsAddModule'
},
{
  path: "",
  loadChildren: './contact-details-modify/contact-details-modify.module#ContactDetailsModifyModule'
},
{
  path: "",
  loadChildren: './contact-details-view/contact-details-view.module#ContactDetailsViewModule'
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactDetailsRoutingModule { }
