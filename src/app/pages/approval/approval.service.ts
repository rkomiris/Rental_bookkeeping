import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
 

  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;
  private TOKEN_URL : string = environment.LOGIN_HOST;
  approvallist(): Observable<{}> {

    let approval = localStorage.getItem('awaitingApproval');
    let header = new Headers();
    header.append('Content-Type', 'application/json');
     let authToken = localStorage.getItem("access_token");
     header.append('Authorization', `Bearer ${authToken}`);
     header.append('userId',localStorage.getItem('userId'));
     let headeroptions = new RequestOptions({ headers: header });
    let bodycontent = {};
    let data1 = {screenJson: {screenId: 19, subScreenId: 39}};
    if(approval !== '1'){
      return this.http.post(this.URL + '/approval/getAll' , data1, headeroptions);
    }else{
      return this.http.post(this.URL + '/awaiting/approvalList' , data1, headeroptions);
    }
    
  }

  logout(data) {
    
    let headers2 = new Headers();
    let body = {id: Number(data)};
    headers2.append('Content-Type', 'application/json');
   // headers2.append('access_token', localStorage.getItem('access_token'));
   let authToken = localStorage.getItem("access_token");
   headers2.append('Authorization', `Bearer ${authToken}`);
   headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    // let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 19}, subScreenMaster: {subScreenId: 40}},
    // requestId : data};
    return this.http.post(this.TOKEN_URL+"/sr/logout", body, headeroptions);
  }
  approvalgetsingle(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    // headers2.append('access_token', localStorage.getItem('access_token'));
    
    let authToken = localStorage.getItem("access_token");
    headers2.append('Authorization', `Bearer ${authToken}`);
    headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    // let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 19}, subScreenMaster: {subScreenId: 40}},
    // requestId : data};
    return this.http.post(this.URL + '/Req/load', body, headeroptions);
  }
  /** */
  approvalfinalgetsingle(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    // headers2.append('access_token', localStorage.getItem('access_token'));    
    let authToken = localStorage.getItem("access_token");
    headers2.append('Authorization', `Bearer ${authToken}`);
    headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let data1 = { screenJson: {screenId: 19,subScreenId: 40},
     requestId : data};
    return this.http.post(this.URL + '/approval/reqLoad', data1, headeroptions);
  }
/** */
  approvalsingle(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    // headers2.append('access_token', localStorage.getItem('access_token'));
     let authToken = localStorage.getItem("access_token");
     headers2.append('Authorization', `Bearer ${authToken}`);
     headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let data1 = { screenJson: {screenId: 19,subScreenId: 40},
    requestWorkFlowAuditVo : {requestId : data}};
    return this.http.post(this.URL + '/approval/load', data1, headeroptions);
  }
  approvalgetall(data) {
    let headers2 = new Headers();
    let body = {requestId: data};
    headers2.append('Content-Type', 'application/json');
    // headers2.append('access_token', localStorage.getItem('access_token'));
     let authToken = localStorage.getItem("access_token");
     headers2.append('Authorization', `Bearer ${authToken}`);
     headers2.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let data1 = { screenJson: {screenId: 19,subScreenId: 40},
    requestWorkFlowAuditVo : {requestId : data}};
    return this.http.post(this.URL + '/approval/loadAll', data1, headeroptions);
  }
  /** */
  updateapprovalDetails(data) {
    let headers3 = new Headers();
    headers3.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers3.append('Authorization', `Bearer ${authToken}`);
     headers3.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers3 });
    // let datas = {remarks: data;
    return this.http.post(this.URL + '/approval/modify', data, headeroptions);
  }
/** */
  load_requestGrid(): Observable<{}> 
  {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
     head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    return this.http.post(this.URL + '/Req/getAll', {}, headeroptions);
  }
  
  search_list(list): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    // head.append('access_token', localStorage.getItem('access_token'));
     let authToken = localStorage.getItem("access_token");
     head.append('Authorization', `Bearer ${authToken}`);
     head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    return this.http.post(this.URL + '/approval/getAllSearch', list, headeroptions);
  }
}

