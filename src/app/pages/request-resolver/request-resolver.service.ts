import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestResolverService {
  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;

  load_resolverList(api): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent = { screenJson:{screenId: 22, subScreenId: 37}};
    return this.http.post(this.URL + api, bodycontent, headeroptions);
  }

  search_list(list): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/resolver/search", list, headeroptions);
  }

  holdStatus(value): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/resolver/holdstatus", {'requestId': value}, headeroptions);
  }

}

