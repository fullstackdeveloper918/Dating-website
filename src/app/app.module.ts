import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterceptorInterceptor } from '../app/core/interceptor/interceptor.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environment';
import { ToastrModule } from 'ngx-toastr';  // Import ToastrModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this module
import { LoaderService } from './core/service/loader/loader.service';
import { TimeAgoPipe } from './core/pipe/time-ago.pipe';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    LoaderService,
    {provide : HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
