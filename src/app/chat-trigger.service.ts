import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
// I imported Subject, BehaviourSubject, Observables but cant get it to work


@Injectable({
    providedIn: 'root'
  })
export class ChatTriggerService {

    // This looked more reliable than Subject so used this; init with value "0"
    public subjectStream = new BehaviorSubject<any>('');


    constructor(){
        this.subjectStream.subscribe(value => {
            // Successfully logs value "1" sent by changeStatus below
        });
    }


    changeStatus(value: any) {
        // Looks correct because it successfully sent value to construct
        this.subjectStream.next(value);
    }

}