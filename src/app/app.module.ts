import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CommandsService } from "./services/commands";
import { ActiveDirectoryService } from "./services/active-dir";
import { PongComponent } from './pong/pong.component';

@NgModule({
  declarations: [
    AppComponent,
    PongComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    ActiveDirectoryService,
    CommandsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
