import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {
  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;
  authenticationList(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    // heade.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent =  {screenId: 23, subScreenId: 42};
    return this.http.post(this.URL + "/auth/getAll", bodycontent, headeroptions);
  }
  search_list(list): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/auth/search", list, headeroptions);
  }
  deleteUserList(list): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = { roleId: list };
    return this.http.post(this.URL + "/auth/delete", data, headeroptions);
  }
  getAddAuthList(): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    // headers.append("access_token", localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      screenJson: {
         screenId: 23 ,
        subScreenId: 43 
      },
      'roleId' : Number(localStorage.getItem('roleId'))
    };
    return this.http.post(
      this.URL + "/auth/add",
      bodyoptions,
      headeroptions
    );
  }
  reportingDepartmentUser(deptId): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      screenAuthorizationMaster: {
        screenMaster: { screenId: 37 },
        subScreenMaster: { subScreenId: 37 }
      },
      userDepartment: deptId
    };
    return this.http.post(
      this.URL + "/master/masterscreenassignment/loadReportingUser",
      bodyoptions,
      headeroptions
    );
  }
  getSubScreen(screenId): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      // screenAuthorizationMaster: {
      //   screenMaster: { screenId: 37 },
      //   subScreenMaster: { subScreenId: 37 }
      // },
      'screenId': screenId,
      'roleId' : Number(localStorage.getItem('roleId'))
    };
    return this.http.post(
      this.URL + "/auth/subscreen",
      bodyoptions,
      headeroptions
    );
  }
  loadSubScreenFields(subScreenId, screenId): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      'subScreenId': subScreenId,
      'screenId' : screenId,
      'roleId' : Number(localStorage.getItem('roleId'))
    };
    return this.http.post(
      this.URL + "/auth/field",
      bodyoptions,
      headeroptions
    );
  }
  loadScrFn(subScreenId, screenId): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      'subScreenId': subScreenId,
      'screenId' : screenId,
      'roleId' : Number(localStorage.getItem('roleId'))
    };
    return this.http.post(
      this.URL + "/auth/function",
      bodyoptions,
      headeroptions
    );
  }
  saveScrAuth(formValue): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = formValue;
    return this.http.post(
      this.URL + "/auth/create",
      bodyoptions,
      headeroptions
    );
  }
  modifySaveScrAuth(formValue): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = formValue;
    return this.http.post(
      this.URL + "/auth/update",
      bodyoptions,
      headeroptions
    );
  }
  getModifyAuthList(): Observable<{}> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("access_token", localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodyoptions = {
      screenAuthorizationMaster: {
        screenMaster: { screenId: 37 },
        subScreenMaster: { subScreenId: 37 }
      },
      screenAuthenticationId: localStorage.getItem("screenAuthenticationId")
    };
    return this.http.post(
      this.URL + "/master/screenassignment/modifyLoad",
      bodyoptions,
      headeroptions
    );
  }
}
