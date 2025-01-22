import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    // NavbarComponent,
    // FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // NavbarComponent,
    // FooterComponent // Export the components so they can be used in other modules
  ]
})
export class SharedModule { }
