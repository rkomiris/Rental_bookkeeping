import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLinkAddComponent } from './external-link-add.component';

const routes: Routes = [{
  path: 'external-link-add',
  component: ExternalLinkAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLinkAddRoutingModule { }

