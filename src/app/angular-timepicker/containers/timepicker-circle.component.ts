import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'timepicker-circle',
    template: `
        <div>
            Timepicker cirvle
           <pre>
           {{ (mouseVals | async)?.clientX }} 
           </pre> 
        </div>
    `,
    styleUrls:['timepicker-circle.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimepickerCircleComponent {
    constructor() {}

    @Input()
    public mouseVals:Subject<MouseEvent>;
}