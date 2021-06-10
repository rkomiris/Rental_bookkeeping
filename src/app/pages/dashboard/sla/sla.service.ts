import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestOptions, Http, Headers } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class SlaService {


  private URL = environment.API_HOST;
  constructor(private http: Http) { }
  /* getWidgetData(){
    const httpOptions ={
      headers:new HttpHeaders({
        'Content-Type':'applicaiton/json',
        'access_token':localStorage.getItem("access_token")
      })
    }
    const httpbody={};

    return this.http.post(this.URL+'/dashboard/myReqdashboard/getAll',httpbody,httpOptions);


  }*/
  getWidgetData() {
    let body = {};
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/slaDashboard/getAll', body, headeroptions);
  }
}

