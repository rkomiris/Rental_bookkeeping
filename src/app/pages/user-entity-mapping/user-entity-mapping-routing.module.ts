import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserEntityMappingComponent } from './user-entity-mapping.component';
import { UserEntityMappingAddComponent } from './user-entity-mapping-add/user-entity-mapping-add.component';

const routes: Routes = [{
  path: '',
  component: UserEntityMappingComponent
},
{
  path: "user-entity-mapping-add",
  loadChildren: './user-entity-mapping-add/user-entity-mapping-add.module#UserEntityMappingAddModule'
},
{
  path: "user-entity-mapping-view",
  loadChildren: './user-entity-mapping-view/user-entity-mapping-view.module#UserEntityMappingViewModule'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEntityMappingRoutingModule { }
