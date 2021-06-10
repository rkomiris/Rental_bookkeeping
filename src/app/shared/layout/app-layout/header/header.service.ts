import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, BehaviorSubject} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  approvallist: any = [];
  appcount: any = 0;
  notificationcount: any = 0;
 // mailDetails: any = [];
  mailDetails1: any = [];
  firstName: string;
  lastName: string;
  displayUserName: String;
  showEntity: any = false;

  constructor(private http: Http) { }
  private messageSource = new BehaviorSubject<string>("default message");
  currentMessage = this.messageSource.asObservable();
  private URL: string = environment.API_HOST;

  // logOut():Observable<{}>{

  //   let headers = new Headers();

  //   headers.append('Content-Type', 'application/json');
  //   headers.append('access_token', localStorage.getItem("access_token"));

  //   let headeroptions = new RequestOptions({ headers: headers });

  //   return this.http.get(this.URL+"/logout", headeroptions );

  // }

  headerDetails():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('access_token', localStorage.getItem("access_token"));

    let headeroptions = new RequestOptions({ headers: headers });
    //return this.http.post(this.URL+"/profile/name",{}, headeroptions );
    return this.http.post(this.URL+"/profile/name",{}, headeroptions );

  }
  mailDetails(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
   // heade.append('access_token', localStorage.getItem("access_token"));
   let authToken = localStorage.getItem("access_token");
   heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL+"/notificationList",{}, headeroptions );

  }
 

  deletenotification(id): Observable<{}> {
    let heade = new Headers();
    let data = { emailMessageId : id};
    heade.append('Content-Type', 'application/json');
    //heade.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL+"/deleteNotification", data, headeroptions );

  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  userName(){
    this.displayUserName = this.firstName + ' ' + this.lastName;
    return this.displayUserName;
  }

  load(): Observable<{}>
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/selection/loadUserEntity",{}, headeroptions );
  }
changeEntity(data): Observable<{}>
{
  let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/selection/selectUserEntity",{ "entityId" : data}, headeroptions );
}

}
