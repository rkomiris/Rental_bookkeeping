import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityAddComponent } from './entity-add.component';

const routes: Routes = [
{
path: '',
component: EntityAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityAddRoutingModule { }
