import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FlashNewsAddService {

  constructor(private http: Http) { }

  private URL: string = environment.API_HOST;

  addProjectList(data): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + '/flashNews/create', bodycontent, headeroptions);
  }
  addflash(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenJson: {screenId: 9, subScreenId: 18}};
    return this.http.post(this.URL+"/flashNews/add", data,  headeroptions);
  }

}
