
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailsModifyComponent } from './contact-details-modify.component';

const routes: Routes = [{
  path: 'contact-details-modify',
  component:ContactDetailsModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactDetailsModifyRoutingModule { }
