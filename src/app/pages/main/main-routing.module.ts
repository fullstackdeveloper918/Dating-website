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
      path : 'profile',
      loadChildren : () => import('./profile/profile.module').then(m => m.ProfileModule)
    },
    {
      path : 'edit-profile',
      loadChildren : () => import('./edit-profile/edit-profile.module').then(m => m.EditProfileModule)
    },
    {
      path: 'referral-code',
      loadChildren : () => import('./referral-code/referral-code.module').then(m => m.ReferralCodeModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
