import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityComponent } from './entity.component';


const routes: Routes = [
  {
   path: '',
   component: EntityComponent
  },
  {
    path: "entity-view",
    loadChildren: './entity-view/entity-view.module#EntityViewModule'
  },
  {
    path: "entity-renewal",
    loadChildren: './entity-renewal/entity-renewal.module#EntityRenewalModule'
  },
  {
    path: "entity-add",
    loadChildren: './entity-add/entity-add.module#EntityAddModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
