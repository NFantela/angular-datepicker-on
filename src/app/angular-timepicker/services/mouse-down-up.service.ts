import { Injectable, ElementRef, Inject } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import {DOCUMENT} from '@angular/common';
import { switchMapTo, takeUntil, endWith, startWith, filter} from 'rxjs/operators';
import { MouseInitiateMoveOrEnd } from '../models/timepicker-observable';


@Injectable()
export class MouseDownUpService extends Observable<MouseInitiateMoveOrEnd> {
    constructor(
        @Inject(ElementRef) private _elRef: ElementRef,
        @Inject(DOCUMENT) private _doc:Document
    ) {
        super((subscriber) => {
            if(!_doc) subscriber.error("No document");
            this.mouseMovementStream$.subscribe(subscriber);
        });
    }

    private _mouseDownStream$ = fromEvent(this._elRef.nativeElement, 'mousedown');
    private _mouseMoveStream$ = fromEvent(this._doc, 'mousemove');
    private _mouseUpStream$ = fromEvent(this._doc, 'mouseup');

    /** Listen on mousedown on main directive attached element emit mosuemoves */
    mouseMovementStream$ = this._mouseDownStream$.pipe(
        switchMapTo(this._mouseMoveStream$.pipe(
            startWith({inProcess:true}),
            // ignore mouse move events this could be used later maybe
            filter(v => !(v instanceof MouseEvent)),
            takeUntil(this._mouseUpStream$),
            endWith({inProcess:false}),
        )),
    );
}