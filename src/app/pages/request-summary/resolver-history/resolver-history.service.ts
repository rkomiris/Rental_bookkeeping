import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, Http, Headers  } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResolverHistoryService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  reqList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/summary/resolverHistory",{}, headeroptions );
  }

  count():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/summary/resolverNumber",{}, headeroptions );
  }

  searchRequest(list): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/summary/resolverSearch", list, headeroptions);
  }

  loadResolverList(data) {
    let headers = new Headers();
    // let body = {
    //   requestId: data
    // };
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = {
      requestId: data,
    }; 
    return this.http.post(this.URL + '/summary/viewAllResolverSummary', bodycontent, headeroptions);
  }
}
