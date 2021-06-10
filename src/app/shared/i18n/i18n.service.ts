import { Injectable, ApplicationRef, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';
import { languages } from './languages.model';


@Injectable()
export class I18nService  implements OnInit {
  public state;
  public data: {};
  public currentLanguage: any;

  constructor(
    private jsonApiService: JsonApiService,
    private ref: ApplicationRef
  ) {
    this.state = new Subject();
    this.initLanguage(localStorage.getItem("langCode"));
    // this.fetch(lang);
  }
  ngOnInit() {
    let lang = localStorage.getItem("langCode");
    this.fetch(lang);
  }

  private fetch(locale: any) {
    this.jsonApiService
      .fetch(`/${locale}.json`)
      .subscribe((data: any) => {
        this.data = data;
        this.state.next(data);
        this.ref.tick();
      });
  }

  private initLanguage(locale: string) {
    if(locale == null){
      locale = environment.defaultLocale;
    }
    let language = languages.find(it => {
      return it.key == locale;
    });
    if (language) {
      this.currentLanguage = language;
    } else {
      throw new Error(`Incorrect locale used for I18nService: ${locale}`);
    }
  }

  setLanguage(language) {
    this.currentLanguage = language;
    this.fetch(language.key);
  }

  subscribe(sub: any, err: any) {
    return this.state.subscribe(sub, err);
  }

  public getTranslation(phrase: string): string {
    if(this.data == null || this.data == undefined){
      this.fetch(localStorage.getItem('langCode'));
    }else{
      this.fetch(localStorage.getItem('langCode'));
    }
    return this.data && this.data[phrase] ? this.data[phrase] : phrase;
  }
}