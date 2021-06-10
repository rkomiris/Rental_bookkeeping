import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLinkModifyComponent } from './external-link-modify.component';

const routes: Routes = [{
  path: 'external-link-modify',
  component: ExternalLinkModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLinkModifyRoutingModule { }

