import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DelegationModifyService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  loadData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data ={ screenJson: {screenId: 28,subScreenId: 54}};
    return this.http.post(this.URL + '/delegationMaster/authAdd', data, headeroptions);
  }

  userDropDown(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/user/dropdown", {}, headeroptions);
  }

  userDetails(delegationid): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/delegationMaster/getAll", {delegationUserId: delegationid}, headeroptions);
  }

  assignData(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + "/delegationMaster/create", bodycontent, headeroptions);
  }

  viewData(delegationId , delegationDetailId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let body = { }
    return this.http.post(this.URL + "/delegationMaster/singleView", {delegationId : delegationId, 
    userDelegationDetailsVo : 
         { delegationDetailId : delegationDetailId}}, headeroptions);
  }

  update(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    // let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + "/delegationMaster/update", data, headeroptions);
  }

  deleteList(userId, delegatedUserId):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });

    return this.http.post(this.URL+"/delegationMaster/delete", {delegationUserId : userId, delegationId: Number(localStorage.getItem("delegationId")), 
      userDelegationDetailsVo : 
         { delegatedUserId : delegatedUserId}}, headeroptions);
  }
}
