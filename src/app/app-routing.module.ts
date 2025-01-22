import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/main/landing.component';

const routes: Routes = [
  {
      path : '',
      loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
      path : 'main',
      component : LandingComponent,
      loadChildren : () => import('./pages/main/main.module').then(m => m.MainModule)
    },
    {
      path : 'messages',
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
