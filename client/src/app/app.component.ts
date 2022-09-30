import { Component } from '@angular/core';
import { SocketIoService } from './socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'CSGO Observer Overlay';
  spec = false;

  constructor(private socketService: SocketIoService){}

  ngOnInit() {
    this.socketService.initSocketConnection();
    this.socketService.socket.on('spec', (data: boolean) => {
      this.spec = data;
    })
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
