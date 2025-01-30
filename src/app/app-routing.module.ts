import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/main/landing.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
      path : '',
      loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
      path : 'main',
      component : LandingComponent,
      canActivate : [AuthGuard],
      loadChildren : () => import('./pages/main/main.module').then(m => m.MainModule)
    },
    {
      path : 'chat',
      canActivate : [AuthGuard],
      loadChildren : () => import('./pages/main/messages/messages.module').then(m => m.MessagesModule)
    }
  // {
  //   path : '',
  //   loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  // },
  // {
  //   path : 'home',
  //   loadChildren : () => import('./pages/main/main.module').then(m => m.MainModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
