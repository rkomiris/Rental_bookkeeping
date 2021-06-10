import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, Http, Headers  } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestHistoryService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  reqList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/summary/othersGetall",{}, headeroptions );
  }

  count():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/summary/othersDashboardCount",{}, headeroptions );
  }

  reqAllList(id):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    let bodyoptions = {
      requestId: id     
    };
    return this.http.post(this.URL+"/summary/othersView",bodyoptions, headeroptions );
  }

  searchRequest(list): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/summary/othersGetallSearch", list, headeroptions);
  }

  myRequestAllList(id):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    let bodyoptions = {
      requestId: id     
    };
    return this.http.post(this.URL+"/summary/myRequestView",bodyoptions, headeroptions );
  }
}
