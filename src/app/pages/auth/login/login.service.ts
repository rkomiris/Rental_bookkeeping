
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: Http) { }


  private TOKEN_URL: string = environment.LOGIN_HOST;
  private URL: string = environment.API_HOST;
  fullurl = environment.API_HOST;
  private FGURL: string = this.fullurl.substring(0, this.fullurl.length - 3);


  postlogin(username, password): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('auth', 'Basic dGVzdGp3dGNsaWVudGlkOlhZN2ttem9OemwxMDA=');
    let headeroptions = new RequestOptions({ headers: headers });
    //let bodycontent = {  "username": username,"password":btoa(password)}
    let bodycontent = {
      "username": username, "password": btoa(password), "grantType": "password"
    }

    return this.http.post(this.TOKEN_URL + "/core/oauth/token", bodycontent, headeroptions);

  }




  postforgotpw(username): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let headeroptions = new RequestOptions({ headers: headers });

    let bodycontent = {
      "userLoginId": username,
    }
    return this.http.post(this.TOKEN_URL + "/common/RT/forgotPassword", bodycontent, headeroptions);
  }


  entityCreation(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('auth', 'Basic dGVzdGp3dGNsaWVudGlkOlhZN2ttem9OemwxMDA=');
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.TOKEN_URL + "/entityMaster/create", data, headeroptions);
  }

  userValid(username):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    let headeroptions = new RequestOptions({ headers: headers });
    
    let bodycontent = {
      "userLoginId": username,
    }
    return this.http.post(this.TOKEN_URL+"/common/forgotPassword/validuser", bodycontent, headeroptions );
  }

  planList():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.TOKEN_URL+"/entityPlanning/list", {}, headeroptions );
  }

  planDetails(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.TOKEN_URL+"/entityPlanning/load", {'planId': data}, headeroptions );
  }

  languageLoad():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/language/dropdown",{}, headeroptions);
  }


}

