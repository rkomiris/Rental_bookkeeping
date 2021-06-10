import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityViewComponent } from './entity-view.component';

const routes: Routes = [
{
path: '',
component: EntityViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityViewRoutingModule { }
