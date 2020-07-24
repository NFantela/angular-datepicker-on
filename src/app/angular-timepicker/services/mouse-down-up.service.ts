import { Injectable, ElementRef, Inject, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {DOCUMENT} from '@angular/common';
import { switchMapTo, takeUntil, endWith, startWith, filter, shareReplay} from 'rxjs/operators';

import { IsMobileService } from './is-mobile.service';
import { zonefree, zonefull } from '../operators/zone-free.operator';
import { typedFromEvent } from '../utils/type-safe-from-event';


@Injectable()
export class MouseDownUpService extends Observable<any> {
    constructor(
        @Inject(ElementRef) private _elRef: ElementRef,
        @Inject(DOCUMENT) private _doc:Document,
        @Inject(IsMobileService) private _isMobileService : IsMobileService,
        @Inject(NgZone) private _zone: NgZone
    ) {
        super((subscriber) => {
            if(!_doc) subscriber.error("No document");
            this.mouseMovementStream$ = this._createCorrectMouseOrTouchStream(_isMobileService._isMobile, _zone);
                
            this.mouseMovementStream$.subscribe(subscriber);
        });
     
    }

    mouseMovementStream$:Observable<any>;


    private readonly _mouseDownStream$ = typedFromEvent(this._elRef.nativeElement, 'mousedown');
    private readonly _mouseMoveStream$ = typedFromEvent(this._doc, 'mousemove');
    private readonly _mouseUpStream$ = typedFromEvent(this._doc, 'mouseup');

    private readonly _touchStartStream$ = typedFromEvent(this._elRef.nativeElement, 'touchstart');
    private readonly _touchMoveStream$ = typedFromEvent(this._elRef.nativeElement, 'touchmove');
    private readonly _touchEndStream$ = typedFromEvent(this._elRef.nativeElement, 'touchend');


    private _createCorrectMouseOrTouchStream(isMobile:boolean, zone:NgZone){
        if(isMobile){
            return this._touchStartStream$.pipe(
                switchMapTo(this._touchMoveStream$.pipe(
                    startWith({inProcess:true}),
                    zonefree(zone),
                    filter(v => !(v instanceof TouchEvent)),
                    zonefull(zone), 
                    takeUntil(this._touchEndStream$),
                    endWith({inProcess:false}),
                ))
            );
        } else {
            return this._mouseDownStream$.pipe(
                switchMapTo(this._mouseMoveStream$.pipe(
                    startWith({inProcess:true}),
                    zonefree(zone),
                    // ignore mouse move events this could be used later maybe
                    filter(v => !(v instanceof MouseEvent)),
                    zonefull(zone), 
                    takeUntil(this._mouseUpStream$),
                    endWith({inProcess:false}),
                ))
            );           
        }
    }
}