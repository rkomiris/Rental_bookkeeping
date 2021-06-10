import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.includes(args)) {
      return true;
    } else {
      return false;
    }
  }

}
