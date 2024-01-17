import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/user';
import { BehaviorSubject, take } from 'rxjs';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, 
              private router:Router) { }

  createHubConnection(user: User){
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl+'presence', {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames=> this.onlineUsersSource.next([...usernames, username])
      })
    });

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames=> this.onlineUsersSource.next(usernames.filter(x=>x !== username))
      })
    });

    this.hubConnection.on('GetOnlineUsers', usernames =>
      this.onlineUsersSource.next(usernames))

      this.hubConnection.on("NewMessageReceived", ({username, knownAs})=>{   
        this.toastr.info(knownAs+' has sent you a new message! Click me to see it')
        .onTap.subscribe({
          next: ()=>this.router.navigateByUrl('/members/'+username+'?tab=4')
        })
      });
  }

  stopHubConnection(){
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
