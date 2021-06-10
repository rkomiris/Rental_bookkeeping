

import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private URL = environment.API_HOST;
  constructor(private http: Http) { }
  /*getWidgetData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'applicaiton/json',
        'access_token': localStorage.getItem("access_token")
      })
    }
    return this.http.post(this.URL + '/dashboard/getAll', {}, httpOptions);


  }*/
  getWidgetData() {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/Req/vo",{}, headeroptions);
  }
  getmoreappData() {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/dashboard/MoreApplication/getAll', {}, headeroptions);
  }

}

