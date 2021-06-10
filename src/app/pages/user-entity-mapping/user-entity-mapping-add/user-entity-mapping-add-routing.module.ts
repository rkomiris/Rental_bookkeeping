import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEntityMappingAddComponent } from './user-entity-mapping-add.component';

const routes: Routes = [{
  path: '',
  component: UserEntityMappingAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEntityMappingAddRoutingModule { }
