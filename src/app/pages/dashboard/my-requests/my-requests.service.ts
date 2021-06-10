import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyRequestsService {

  private URL = environment.API_HOST;
  constructor(private http: Http) { }

 /* getWidgetData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'applicaiton/json',
        'access_token': localStorage.getItem('access_token')
      })
     };
    const httpbody = {};
    return this.http.post(this.URL + '/dashboard/myReqdashboard/getAll', httpbody, httpOptions);
  }*/
  getWidgetData() {
    let heade = new Headers();
    let body = {};
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/dashboard/myReqdashboard/getAll', body, headeroptions);
  }


  // navMyRequest(data){
  //   const httpOptions ={
  //     headers:new HttpHeaders({
  //       'Content-Type':'applicaiton/json',
  //       'access_token':localStorage.getItem("access_token")
  //     })
  //   }

  //   let httpbody ={
  //     "currentStatusId": data,
  //    }
  //   return this.http.post(this.URL+'/DR/load',httpbody,httpOptions);
  // }




}

