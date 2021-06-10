import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomconfigViewComponent } from './roomconfig-view.component';

const routes: Routes = [{
  path: 'roomconfig-view',
  component: RoomconfigViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomconfigViewRoutingModule { }
