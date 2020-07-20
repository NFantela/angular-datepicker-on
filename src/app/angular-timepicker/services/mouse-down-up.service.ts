import { Injectable, ElementRef, Inject } from '@angular/core';
import { Observable, fromEvent, animationFrameScheduler } from 'rxjs';
import {DOCUMENT} from '@angular/common';
import { switchMapTo, takeUntil, endWith, startWith, auditTime} from 'rxjs/operators';
import { MouseInitiateMoveOrEnd } from '../models/timepicker-observable';


@Injectable()
export class MouseDownUpService extends Observable<MouseInitiateMoveOrEnd> {
    constructor(
        @Inject(ElementRef) private _elRef: ElementRef,
        @Inject(DOCUMENT) private _doc:Document
    ) {
        super((subscriber) => {
            // todo
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
            auditTime(0, animationFrameScheduler),
            takeUntil(this._mouseUpStream$),
            endWith({inProcess:false}),
        )),
    );
}