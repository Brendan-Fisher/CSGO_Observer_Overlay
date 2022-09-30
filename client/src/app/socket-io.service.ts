import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  socket: any;

  constructor() { }

  initSocketConnection(){
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  disconnect(){
    if(this.socket){
      this.socket.disconnect();
    }
  }
}
