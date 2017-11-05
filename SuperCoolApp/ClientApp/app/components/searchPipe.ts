import { Pipe, PipeTransform } from '@angular/core';

// This pipe is used to filter tables contents.
@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {
    transform(value: any, input: string, searchableList: any) {
        if (input) {
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                var isTrue;
                var k;
                var aux;
                for (k = 0; k < searchableList.length; k++) {
                    aux = el[searchableList[k]].toString();
                    if (aux.toLowerCase().indexOf(input) > -1) {
                        isTrue = true;
                    }
                    if (isTrue) {
                        return el
                    }
                }
            })
        }
        return value;
    }
}