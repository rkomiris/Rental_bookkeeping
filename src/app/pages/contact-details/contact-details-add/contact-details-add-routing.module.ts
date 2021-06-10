
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailsAddComponent } from './contact-details-add.component';

const routes: Routes = [{
  path: 'contact-details-add',
  component:ContactDetailsAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactDetailsAddRoutingModule { }
