import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FlashNewsService {

  constructor(private http: Http) { }

  private URL: string = environment.API_HOST;

  load_flashNewsData(): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head });
    //let data = {screenMaster: {screenId: 9}, subScreenMaster: {subScreenId: 17}};
    let data = {screenId:9,subScreenId:17};
    return this.http.post(this.URL + '/flashNews/getAll', data, headeroptions );

  }
  search_list(list): Observable<{}> {

    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head });
    // let searchData = data;
    return this.http.post(this.URL + '/flashNews/getAllSearch', list, headeroptions);
  }

  deleteProjectList(id): Observable<{}> {
    let head = new Headers();
   // head.append('access_token', localStorage.getItem('access_token'));
   let authToken = localStorage.getItem("access_token");
   head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    let bodyoptions = {
        idList: id,
    };
    return this.http.post(this.URL + '/flashNews/delete', bodyoptions, headeroptions);
}
}
