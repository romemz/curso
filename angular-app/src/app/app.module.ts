import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresentacionJahirComponent } from './presentacion-jahir/presentacion-jahir.component';
import { PresentacionJaimeComponent } from './presentacion-jaime/presentacion-jaime.component';

@NgModule({
  declarations: [
    AppComponent,
    PresentacionJahirComponent,
    PresentacionJaimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
