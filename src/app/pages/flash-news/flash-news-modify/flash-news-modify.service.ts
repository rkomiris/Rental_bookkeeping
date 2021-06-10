import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class FlashNewsModifyService {

  constructor(private http: Http) { }

  private URL: string = environment.API_HOST;

  load_modify_project(data): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    let data1 = {screenJson: {screenId: 9,subScreenId: 18},
    id: data};
    return this.http.post(this.URL +"/flashNews/view", data1, headeroptions);
  }

    update_modify_project(data): Observable<{}> {
      
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    let bodycontent = Object.assign(data, {"id" : Number(localStorage.getItem('id'))});
    return this.http.post(this.URL + "/flashNews/update", bodycontent, headeroptions);
  }
}
