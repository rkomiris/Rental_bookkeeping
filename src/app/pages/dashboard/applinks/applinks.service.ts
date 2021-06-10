import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class ApplinksService {



  private URL = environment.API_HOST;
  constructor(private http: Http) { }
  /*getWidgetData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'applicaiton/json',
        'access_token': localStorage.getItem('access_token')
      })
    };
    let jdata = {};
    return this.http.post(this.URL + '/dashboard/exLinkdashboard/getAll', jdata, httpOptions);
  }*/
getWidgetData() {
   let body = {};
   let heade = new Headers();
   heade.append('Content-Type', 'application/json');
   let authToken = localStorage.getItem("access_token");
   heade.append('Authorization', `Bearer ${authToken}`);
   let headeroptions = new RequestOptions({ headers: heade });
  return this.http.post(this.URL + '/dashboard/exLinkdashboard/getAll', body, headeroptions);
}
getawaitingData() {
  let body = {};
  let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
  return this.http.post(this.URL + '/awaiting/approvalList', body, headeroptions);
}
getawaitingDataCount() {
  let body = {};
  let heade = new Headers();
  heade.append('Content-Type', 'application/json');
  let authToken = localStorage.getItem("access_token");
  heade.append('Authorization', `Bearer ${authToken}`);
  let headeroptions = new RequestOptions({ headers: heade });
  return this.http.post(this.URL + '/awaiting/approvalListCount', body, headeroptions);
}
getawaitingResolverDataCount() {
   let body = {};
   let heade = new Headers();
   heade.append('Content-Type', 'application/json');
   let authToken = localStorage.getItem("access_token");
   heade.append('Authorization', `Bearer ${authToken}`);
   let headeroptions = new RequestOptions({ headers: heade });
  return this.http.post(this.URL + '/awaiting/resolverListCount', body, headeroptions);
}
}

