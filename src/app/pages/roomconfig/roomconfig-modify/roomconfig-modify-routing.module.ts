import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomconfigModifyComponent } from './roomconfig-modify.component';

const routes: Routes = [{
  path: 'roomconfig-modify',
  component: RoomconfigModifyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomconfigModifyRoutingModule { }
