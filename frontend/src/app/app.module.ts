import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DiscoverComponent } from './components/discover/discover.component';

const routes: Routes = [
  { path: 'discover', component: DiscoverComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
