
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailsViewComponent } from './contact-details-view.component';

const routes: Routes = [{
  path: 'contact-details-view',
  component:ContactDetailsViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactDetailsViewRoutingModule { }
