import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLinkViewComponent } from './external-link-view.component';

const routes: Routes = [{
  path: 'external-link-view',
  component: ExternalLinkViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLinkViewRoutingModule { }

