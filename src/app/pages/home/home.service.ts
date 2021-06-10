
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  
// .substring(environment.API_HOST.length - 3) ;
  login(): Observable<{}> {
    let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem('access_token'));
    // let headeroptions = new RequestOptions({ headers: headers });
    // let data = {screenAuthorizationMaster: {screenMaster: {screenId: 18}, subScreenMaster: {subScreenId: 33}}};
    return this.http.get(this.URL + '/normal');
  }
}
