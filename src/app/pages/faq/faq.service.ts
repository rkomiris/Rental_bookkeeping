import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FaqService {

  constructor(private http: Http) { }

  private URL: string = environment.API_HOST;

  get_faq(): Observable<{}> {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');

    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: headers });
    // let bodycontent = {
    //   "username":username,
    // }

    return this.http.post(this.URL+"/faq/view", {}, headeroptions);
  }


}
