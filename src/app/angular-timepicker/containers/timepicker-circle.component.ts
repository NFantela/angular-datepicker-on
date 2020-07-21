import { Component, ChangeDetectionStrategy, Input, ViewChild, 
    ElementRef, OnDestroy, NgZone, Inject, AfterViewInit } from '@angular/core';
import { Subject, fromEvent, merge, Subscription } from 'rxjs';
import { pluck, pairwise, map, filter } from 'rxjs/operators';
import { HoursOrMins } from '../models/hours-mins';

@Component({
    selector: 'timepicker-circle',
    templateUrl: 'timepicker-circle.component.html',
    styleUrls:['timepicker-circle.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimepickerCircleComponent implements OnDestroy, AfterViewInit{

    constructor(@Inject(NgZone) private _zone:NgZone) {}

    constHoursOrMinutes:Number[] = [];

    @ViewChild('clockParentList') clockParentList:ElementRef;

    @Input()
    mouseEnterActiveTarget:Subject<number>;

    private _mouseOverSub:Subscription;

    @Input()
    set hoursOrMins(val:HoursOrMins){
        if(val){
            let repetitions = 1; 
            val === 'hours' ? repetitions = 23: repetitions = 12;
            // TODO FIX this to true values
            for(let i = 1; i <= repetitions; i++) {
                this.constHoursOrMinutes.push(i);
            }
            this._hoursOrMins = val;
        }
    }
    get hoursOrMins(){return this._hoursOrMins; }
    private _hoursOrMins:HoursOrMins;

    ngAfterViewInit(){
        // capture mouseover and mouseout events on parent el and using
        // ev delegation grab hovered span elements
        this._zone.runOutsideAngular(() => 
            this._mouseOverSub = merge( 
                fromEvent(this.clockParentList.nativeElement, 'mouseover') , 
                fromEvent(this.clockParentList.nativeElement, 'mouseout')
            ).pipe(
                filter((ev:MouseEvent) => (<HTMLElement>ev.target).nodeName === 'LI'),
                pluck('target', 'innerHTML'),
                pairwise(),
                map(([prevVal, currVal]:[string, string]) => {
                    if(prevVal === currVal){
                        return NaN;
                    }
                    return parseInt(currVal, 10);
                }),
            ).subscribe(v => this.mouseEnterActiveTarget.next(v))
        );
    }

    ngOnDestroy(){
        this._mouseOverSub && this._mouseOverSub.unsubscribe();
    }
}