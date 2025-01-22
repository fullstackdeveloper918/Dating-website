import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { LandingComponent } from './landing.component';

const routes: Routes = [
    {
      path : '',
      redirectTo : 'home',
      pathMatch : 'full'
    },
    {
      path : 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path : 'view-profile',
      loadChildren : () => import('./profile/profile.module').then(m => m.ProfileModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
