import { Injectable, Inject } from '@angular/core';
import { NAVIGATOR } from '../tokens/navigator';

@Injectable({providedIn:'root'})
export class IsMobileService {
    constructor(
        @Inject(NAVIGATOR) private _navigator: Navigator
    ) {
        if(_navigator){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(_navigator.userAgent) ) {
               this._isMobile = true;
            }
        }
    }

    public _isMobile = false;
}