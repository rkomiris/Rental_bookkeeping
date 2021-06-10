import { WidgetReadmoreDetailComponent } from './widget-readmore-detail/widget-readmore-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

const routes: Routes = [{
  path: '',
  component: LandingPageComponent
},
{
path: 'detail/:date/:id/:position',
 component:WidgetReadmoreDetailComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LandingPageRoutingModule { }
