import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, Http, Headers  } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestApprovalService {
  

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  reqList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/summary/approvalGetall",{}, headeroptions );
  }
  
  count():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });   
    return this.http.post(this.URL+"/summary/approvalDashboardCount",{}, headeroptions );
  }

  reqAllList(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers2.append('Authorization', `Bearer ${authToken}`);
    headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let data1 = { screenJson: {screenId: 19 , subScreenId: 40},
    requestWorkFlowAuditVo : {requestId : data}};
    return this.http.post(this.URL + '/approval/load', data1, headeroptions);
  }

  userBaseField(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    headers2.append('access_token', localStorage.getItem('access_token'));
    headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let data1 = { screenJson: {screenId: 19 , subScreenId: 40},
    requestWorkFlowAuditVo : {requestId : data}};
    return this.http.post(this.URL + '/approval/reqLoad', data1, headeroptions);
  }

  approvalgetall1(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    headers2.append('access_token', localStorage.getItem('access_token'));
    headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let data1 = { screenJson: {screenId: 19 , subScreenId: 40},
    requestWorkFlowAuditVo : {requestId : data}};
    return this.http.post(this.URL + '/approval/loadAll', data1, headeroptions);
 
  } 
  searchRequest(list): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/Req/search", list, headeroptions);
  }
}
