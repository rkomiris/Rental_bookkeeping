import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityRenewalComponent } from './entity-renewal.component';

const routes: Routes = [
{
path: '',
component: EntityRenewalComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRenewalRoutingModule { }
