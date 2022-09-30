import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SocketIoService } from './socket-io.service';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoreboardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SocketIoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
