import {  Component , OnInit, ViewChild } from '@angular/core';
import { ComponentLoaderService } from './shared/component-loader.service';
import { Router,NavigationEnd  } from '@angular/router';
import { ChatAdapter, ParticipantResponse, ChatParticipantType, ChatParticipantStatus, IChatController } from 'ng-chat';
// import { SocketIOAdapter} from './socketio-adapter';
// import { Socket } from 'ng-socket-io';
import { Http } from '@angular/http';
// import { ChatTriggerService } from './chat-trigger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rta';
  loginstatus:boolean;
  userId: string;
  username: string;
  showLoader: boolean;
  public adapter: ChatAdapter;
  currentUrl : string;
  @ViewChild('ngChatInstance') protected ngChatInstance: IChatController;
  constructor(
    // private socket: Socket, 
    private http: Http,
    // private chatTriggerService:ChatTriggerService,
    private componentloaderService: ComponentLoaderService , private route:Router){
    this.routeEvent(this.route);

    // this.InitializeSocketListerners();

    /*this.chatTriggerService.subjectStream.subscribe((data)=>{
      if(!this.userId && data && data !=='close') {
        this.socket.emit('join',data);
      }
      if(data =='close') {
        this.userId=null;
        this.socket.emit('leave',this.userId);
      }
    })*/
  }
  ngOnInit() {
    this.componentloaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
  });
}
routeEvent(router: Router){
  router.events.subscribe(e => {
if(e instanceof NavigationEnd){
       this.currentUrl = e.url;
    }
  });
}

/*
public joinRoom(): void {
  this.socket.emit("join", this.username);
}*/

/*
public InitializeSocketListerners(): void {
  this.socket.on("generatedUserId", (userId) => {
    // Initializing the chat with the userId and the adapter with the socket instance
    this.adapter = new SocketIOAdapter(userId, this.socket, this.http);
    this.userId = userId;
  });
}
*/



}
