import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationViewService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  load_ScreenselectBoxData():Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/screen/dropdown",{}, headeroptions);
  }
  load_userRoleselectBoxData():Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/roleLoad",{}, headeroptions);
  }
  getAuthentication(data):Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/authentication/view", {'authenticationId' :data},  headeroptions);
  }
  modifyAuthentication(data):Observable<{}>{ 
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/authentication/update", data,  headeroptions);
  }
}
