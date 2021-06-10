import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoombookapprovalService {
  private URL: string = environment.API_HOST;
  constructor(private http: Http) { }

  approvallist(): Observable<{}> {
    let headers1 = new Headers();
    headers1.append('Content-Type', 'application/json');
    headers1.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: headers1 });
    // let bodycontent = {};
    let bodycontent = {screenMaster: {screenId: 21}, subScreenMaster: {subScreenId: 44}};
    // return this.http.post(this.URL + '/roombookingApproval/getAll', bodycontent, headeroptions);
    return this.http.post(this.URL + '/roombookingApproval/getAll', bodycontent, headeroptions);
  }



  approvalgetsingle(data) {
    let headers2 = new Headers();
    let body = {roomBookingId: data};
    headers2.append('Content-Type', 'application/json');
    headers2.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 21}, subScreenMaster: {subScreenId: 45}},
      roomBookingId: data,
    };
    // return this.http.post(this.URL + '/roombookingApproval/view', body, headeroptions);
    return this.http.post(this.URL + '/roombookingApproval/view', bodycontent, headeroptions);
  }





  approvalsingle(data) {
    let headers2 = new Headers();
    let body = {roomBookingId: data};
    headers2.append('Content-Type', 'application/json');
    headers2.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 21}, subScreenMaster: {subScreenId: 45}},
    roomBookingId: data,
  };
    return this.http.post(this.URL + '/roombookingApproval/load', bodycontent, headeroptions);
  }
  approvalgetall(data) {
    let headers2 = new Headers();
    let body = {roomBookingId: data};
    headers2.append('Content-Type', 'application/json');
    headers2.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: headers2 });
    let bodycontent = {screenAuthorizationMaster:{screenMaster: {screenId: 21}, subScreenMaster: {subScreenId: 45}},
    roomBookingId: data,
  };
    return this.http.post(this.URL + '/roombookingApproval/loadAll', bodycontent, headeroptions);
  }
  updateapprovalDetails(data) {
    let headers3 = new Headers();
    headers3.append('Content-Type', 'application/json');
    headers3.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: headers3 });
    return this.http.post(this.URL + '/roombookingApproval/update', data, headeroptions);
  }



  load_requestGrid(): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head });
    // let bodycontent = {screenMaster: {screenId: 21}, subScreenMaster: {subScreenId: 44}};
    return this.http.post(this.URL + '/Req/getAll', {}, headeroptions);
    // return this.http.post(this.URL + '/roombookingApproval/getAll', bodycontent, headeroptions);
  }


  search_list(list): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head });
    return this.http.post(this.URL + '/roombookingApproval/search', list, headeroptions);
  }
}
