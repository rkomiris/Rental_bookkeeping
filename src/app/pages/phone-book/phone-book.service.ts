import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PhoneBookService {

  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;

  search_list(list): Observable<{}> {

    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    // head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head });
    // let searchData = data;
    return this.http.post(this.URL + '/phoneBooking/firstSearch', list, headeroptions);
  }

  getAll():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    // headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    //let data = {screenMaster: {screenId: 26}, subScreenMaster: {subScreenId: 49}};
    return this.http.post(this.URL+"/emergency/getAllDownload",{}, headeroptions );
  }
}

