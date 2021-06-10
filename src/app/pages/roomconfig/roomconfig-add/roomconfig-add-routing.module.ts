import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomconfigAddComponent } from './roomconfig-add.component';

const routes: Routes = [{
  path: 'roomconfig-add',
  component: RoomconfigAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomconfigAddRoutingModule { }
