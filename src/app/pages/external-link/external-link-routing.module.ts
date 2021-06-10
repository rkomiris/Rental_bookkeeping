import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLinkComponent } from './external-link.component';

const routes: Routes = [{
  path: '',
  component: ExternalLinkComponent
},
{
  path: "",
  loadChildren: "./external-link-add/external-link-add.module#ExternalLinkAddModule"
},
{
  path: "",
  loadChildren: "./external-link-modify/external-link-modify.module#ExternalLinkModifyModule"
},
{
  path: "",
  loadChildren: "./external-link-view/external-link-view.module#ExternalLinkViewModule"
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalLinkRoutingModule { }

